import { NextRequest, NextResponse } from 'next/server';
import { getInterchangeAnalytics } from '@/lib/multimodal/interchangeAnalytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hubId = searchParams.get('hubId');
    const analytics = getInterchangeAnalytics();

    if (hubId) {
      const hub = analytics.getHubById(hubId);
      if (!hub) {
        return NextResponse.json(
          { error: `Interchange hub "${hubId}" not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        generatedAt: new Date().toISOString(),
        hub,
      });
    }

    const report = analytics.getSummaryReport();
    return NextResponse.json({
      success: true,
      ...report,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error fetching interchange analytics:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve interchange analytics',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

