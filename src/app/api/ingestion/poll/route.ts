import { NextResponse } from 'next/server';
import { getObservationLedger } from '@/lib/ingestion/observationLedger';

export async function POST() {
  try {
    const ledger = getObservationLedger();
    const metrics = await ledger.syncAllSources();
    const sourceHealth = ledger.getSourceHealth();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics,
      sourceHealth,
      recentObservationsCount: ledger.getObservations(10).length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to poll ingestion sources',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const ledger = getObservationLedger();
  return NextResponse.json({
    metrics: ledger.getMetrics(),
    sourceHealth: ledger.getSourceHealth(),
    latestTimestamp: new Date().toISOString(),
  });
}
