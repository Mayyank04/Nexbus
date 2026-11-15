import { NextRequest, NextResponse } from 'next/server';
import { getResilienceEngine } from '@/lib/multimodal/networkResilience';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scenarioId = searchParams.get('scenarioId');
    const engine = getResilienceEngine();

    if (!scenarioId) {
      return NextResponse.json({
        success: true,
        availableScenarios: engine.getAvailableScenarios(),
        baselineEvaluation: engine.evaluateResilience('ring-road-waterlogging'),
      });
    }

    const evaluation = engine.evaluateResilience(scenarioId);
    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error evaluating network resilience:', error);
    return NextResponse.json(
      {
        error: 'Failed to evaluate network resilience',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const scenarioId = body.scenarioId || 'ring-road-waterlogging';
    const engine = getResilienceEngine();
    const evaluation = engine.evaluateResilience(scenarioId);

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error('Error processing resilience evaluation POST:', error);
    return NextResponse.json(
      {
        error: 'Invalid request body or resilience evaluation failure',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}
