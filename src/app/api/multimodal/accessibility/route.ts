import { NextRequest, NextResponse } from 'next/server';
import { getAccessibilityService } from '@/lib/multimodal/accessibilityService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const profileParam = searchParams.get('profile');
    const service = getAccessibilityService();

    let profile: any = 'GENERAL_PEDESTRIAN';
    if (profileParam) {
      const p = profileParam.toUpperCase();
      if (p.includes('WHEEL') || p === 'WHEELCHAIR_ACCESSIBLE') {
        profile = 'WHEELCHAIR_ACCESSIBLE';
      } else if (p.includes('ELDER') || p === 'ELDERLY_MOBILITY') {
        profile = 'ELDERLY_MOBILITY';
      }
    }

    if (latStr && lngStr) {
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (isNaN(lat) || isNaN(lng)) {
        return NextResponse.json(
          { error: 'Invalid latitude or longitude query parameters' },
          { status: 400 }
        );
      }
      const nearest = service.findNearestTransit(lat, lng);
      return NextResponse.json({
        success: true,
        query: { lat, lng },
        nearestTransit: nearest,
      });
    }

    const report = service.getCoverageReport(profile);
    return NextResponse.json({
      success: true,
      ...report,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error fetching accessibility coverage report:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve accessibility coverage report',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

