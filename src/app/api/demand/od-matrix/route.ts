import { NextRequest, NextResponse } from 'next/server';
import { getODMatrixEngine } from '@/lib/demand/odMatrixEngine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeWindow = (searchParams.get('timeWindow') as any) || 'AM_PEAK';
    const dayType = (searchParams.get('dayType') as any) || 'weekday';
    const isSynthetic = searchParams.get('synthetic') === 'true';

    const engine = getODMatrixEngine();
    const report = engine.generateODMatrix(timeWindow, dayType, isSynthetic);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error generating OD Matrix report:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate Origin-Destination matrix report',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
