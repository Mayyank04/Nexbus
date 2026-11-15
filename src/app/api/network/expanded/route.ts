import { NextRequest, NextResponse } from 'next/server';
import { expandedNetworkService } from '@/lib/multimodal/expandedNetworkService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const districtFilter = searchParams.get('district');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;

    const validationReport = expandedNetworkService.validateExpandedNetwork();
    let stops = expandedNetworkService.getStops();

    if (districtFilter) {
      stops = stops.filter((s) => s.district.toLowerCase() === districtFilter.toLowerCase());
    }

    const paginatedStops = stops.slice(0, limit);
    const routes = expandedNetworkService.getRoutes();

    return NextResponse.json({
      success: true,
      scope: 'DELHI_EXPANDED_MULTIMODAL_NETWORK',
      validationReport,
      totalMatchedStops: stops.length,
      returnedStops: paginatedStops,
      routes,
      invariant: 'READ-ONLY + PASSIVE + ADVISORY',
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error fetching expanded network:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve expanded transit network',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
