import { NextRequest, NextResponse } from 'next/server';
import { getInterchangeCongestionService } from '@/lib/multimodal/interchangeCongestionService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hubId = searchParams.get('hubId');
    const timePeriod = (searchParams.get('timePeriod') as 'AM_PEAK' | 'PM_PEAK' | 'OFF_PEAK') || 'AM_PEAK';

    const service = getInterchangeCongestionService();

    if (hubId) {
      const diagnostic = service.evaluateHubCongestion(hubId, timePeriod);
      if (!diagnostic) {
        return NextResponse.json(
          { error: `Interchange hub "${hubId}" not found for congestion diagnostics.` },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        generatedAt: new Date().toISOString(),
        diagnostic,
      });
    }

    const diagnostics = service.getAllHubCongestion(timePeriod);
    const avgIci = Math.round(diagnostics.reduce((a, d) => a + d.interchangeCongestionIndex, 0) / diagnostics.length);

    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      timePeriod,
      totalHubsAnalyzed: diagnostics.length,
      networkAverageICI: avgIci,
      diagnostics,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error evaluating interchange congestion:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve interchange congestion diagnostics',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
