import { NextRequest, NextResponse } from 'next/server';
import { getModelExplainabilityService } from '@/lib/ml/modelExplainability';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const corridorId = searchParams.get('corridorId') || 'corridor-ring-road';
    const horizon = parseInt(searchParams.get('horizon') || '30', 10);
    const isPeak = searchParams.get('isPeak') !== 'false';

    const service = getModelExplainabilityService();
    const explanation = service.explainForecast(corridorId, horizon, isPeak);

    return NextResponse.json({
      success: true,
      explanation,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error fetching model explanation:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate model explanation report',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
