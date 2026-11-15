import { NextResponse } from 'next/server';
import { getObservationLedger } from '@/lib/ingestion/observationLedger';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const corridorId = searchParams.get('corridorId') || undefined;
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.min(200, Math.max(1, parseInt(limitParam, 10))) : 50;

  const ledger = getObservationLedger();
  const observations = ledger.getObservations(limit, corridorId);

  return NextResponse.json({
    success: true,
    count: observations.length,
    corridorFilter: corridorId || 'ALL',
    observations,
    metrics: ledger.getMetrics(),
    timestamp: new Date().toISOString(),
  });
}
