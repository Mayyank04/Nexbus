import { NextResponse } from 'next/server';
import { DELHI_ROUTES, DELHI_CORRIDORS } from '@/data/delhiTransitData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const corridorId = searchParams.get('corridorId');
  const type = searchParams.get('type');

  let routes = DELHI_ROUTES;

  if (corridorId) {
    routes = routes.filter((r) => r.corridorId === corridorId);
  }

  if (type) {
    routes = routes.filter((r) => r.type.toLowerCase().includes(type.toLowerCase()));
  }

  return NextResponse.json({
    success: true,
    count: routes.length,
    data: routes,
    corridors: DELHI_CORRIDORS,
    metadata: {
      source: 'Delhi Transport Corporation (DTC) GTFS Feed',
      lastUpdated: new Date().toISOString(),
      coverageArea: 'National Capital Territory of Delhi',
      coordinateSystem: 'EPSG:7761 WGS 84',
    },
  });
}
