import { NextRequest, NextResponse } from 'next/server';
import { getObservationLedger } from '@/lib/ingestion/observationLedger';
import { fieldObservationService, FieldObservationSubmission } from '@/lib/ingestion/fieldObservationService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const corridorId = searchParams.get('corridorId') || undefined;
    const observationType = searchParams.get('type') as any || undefined;
    const collectionStatus = searchParams.get('collectionStatus') as any || undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(200, Math.max(1, parseInt(limitParam, 10))) : 50;

    // 1. Query baseline observation ledger (for backwards compatibility with existing harnesses)
    const ledger = getObservationLedger();
    const legacyObservations = ledger.getObservations(limit, corridorId);

    // 2. Query Phase 12/13 field observations
    const fieldResult = fieldObservationService.queryObservations({
      corridorId,
      observationType,
      collectionStatus,
      limit,
    });

    return NextResponse.json({
      success: true,
      count: legacyObservations.length,
      corridorFilter: corridorId || 'ALL',
      collectionStatusFilter: collectionStatus || 'ALL',
      observations: legacyObservations,
      metrics: ledger.getMetrics(),
      fieldResearch: {
        totalFieldObservations: fieldResult.count,
        summary: fieldResult.summary,
        observations: fieldResult.observations,
        privacyGuarantees: {
          observerPseudonymization: 'HMAC-SHA256 with rotating salt',
          gpsSpatialTruncation: '4 decimal places (~11 meters resolution)',
          temporalQuantization: '15-second rounding',
          zeroPiiEnforced: true,
        },
      },
      timestamp: new Date().toISOString(),
      invariant: 'READ-ONLY + PASSIVE + ADVISORY',
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error in GET /api/ingestion/observations:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve observations',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 512000) {
      return NextResponse.json(
        {
          error: 'Payload Too Large',
          details: 'Observation submission exceeds maximum allowed payload ceiling of 500 KB',
        },
        { status: 413 }
      );
    }

    const body: FieldObservationSubmission = await request.json();

    if (!body.voluntaryConsentConfirmed) {
      return NextResponse.json(
        {
          error: 'Missing consent',
          details: 'Voluntary research consent must be explicitly asserted (voluntaryConsentConfirmed: true)',
        },
        { status: 400 }
      );
    }

    if (!body.stopId || !body.routeId || !body.corridorId) {
      return NextResponse.json(
        {
          error: 'Validation failure',
          details: 'Mandatory fields missing: stopId, routeId, corridorId',
        },
        { status: 400 }
      );
    }

    const recorded = fieldObservationService.recordObservation(body);

    return NextResponse.json({
      success: true,
      action: 'OBSERVATION_RECORDED',
      observation: recorded,
      invariant: 'READ-ONLY + PASSIVE + ADVISORY',
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error in POST /api/ingestion/observations:', error);
    const msg = error instanceof Error ? error.message : String(error);
    const isValidation =
      msg.includes('boundary') ||
      msg.includes('boundaries') ||
      msg.includes('bounds') ||
      msg.includes('negative') ||
      msg.includes('invalid') ||
      msg.includes('Voluntary');
    return NextResponse.json(
      {
        error: isValidation ? 'Validation failure' : 'Failed to record field observation',
        details: msg,
      },
      { status: isValidation ? 400 : 500 }
    );
  }
}
