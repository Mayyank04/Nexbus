import { NextResponse } from 'next/server';
import { DELHI_STOPS } from '@/data/delhiTransitData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zone = searchParams.get('zone');
  const query = searchParams.get('q');

  let stops = DELHI_STOPS;

  if (zone) {
    stops = stops.filter((s) => s.zone.toLowerCase() === zone.toLowerCase());
  }

  if (query) {
    const q = query.toLowerCase();
    stops = stops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.hindiName.includes(q) ||
        s.code.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    count: stops.length,
    data: stops,
    metadata: {
      source: 'DIMTS Integrated Stop Database',
      totalRegisteredStops: 4620,
      activeMonitoringNodes: stops.length,
    },
  });
}
