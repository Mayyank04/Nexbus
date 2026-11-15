import { NextResponse } from 'next/server';
import { getHistoricalStore, StoragePartition } from '@/lib/storage/historicalStore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const corridorId = searchParams.get('corridorId') || undefined;
  const partition = (searchParams.get('partition') as StoragePartition) || undefined;
  const fromTimestamp = searchParams.get('from') || undefined;
  const toTimestamp = searchParams.get('to') || undefined;
  const aggregate = searchParams.get('aggregate') === 'true';
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.min(500, Math.max(1, parseInt(limitParam, 10))) : 50;

  const store = getHistoricalStore();

  if (aggregate && corridorId) {
    const summary = store.aggregateCorridor(corridorId, 24);
    return NextResponse.json({
      success: true,
      aggregation: summary,
      partitionTotals: store.getPartitionSummary(),
      timestamp: new Date().toISOString(),
    });
  }

  const records = store.query({
    corridorId,
    partition,
    fromTimestamp,
    toTimestamp,
    limit,
  });

  return NextResponse.json({
    success: true,
    count: records.length,
    filters: {
      corridorId: corridorId || 'ALL',
      partition: partition || 'ALL',
      limit,
    },
    partitionSummary: store.getPartitionSummary(),
    records,
    timestamp: new Date().toISOString(),
  });
}
