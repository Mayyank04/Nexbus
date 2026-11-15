import { NextResponse } from 'next/server';
import { getCorridorBenchmarkDossier } from '@/lib/analytics/corridorBenchmarks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const corridorId = searchParams.get('corridorId') || undefined;

  const benchmarks = getCorridorBenchmarkDossier(corridorId);

  if (corridorId && benchmarks.length === 0) {
    return NextResponse.json(
      { success: false, error: `Corridor ${corridorId} not found in benchmark registry` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    count: benchmarks.length,
    corridors: benchmarks,
    evaluationScope: '30-Day Bounded Empirical Observation Baseline',
    separationRuleAffirmation:
      'Vehicle kinematics (GPS velocity, headway variance) are mathematically segregated from passenger demand (ETM ticketing aggregates).',
    timestamp: new Date().toISOString(),
  });
}
