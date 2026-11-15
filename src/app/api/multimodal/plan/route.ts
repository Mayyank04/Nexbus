import { NextRequest, NextResponse } from 'next/server';
import { getJourneyEngine, JourneyPreference } from '@/lib/multimodal/journeyEngine';
import { getMultimodalNetwork } from '@/lib/multimodal/networkGraph';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const preference = searchParams.get('preference') as JourneyPreference | null;
    const stepFree = searchParams.get('stepFree') === 'true';

    if (!origin || !destination) {
      return NextResponse.json(
        {
          error: 'Missing required query parameters: "origin" and "destination".',
          availableNodes: getMultimodalNetwork().getAllNodes().map((n) => ({
            id: n.id,
            name: n.name,
            type: n.type,
            zone: n.zone,
          })),
        },
        { status: 400 }
      );
    }

    const engine = getJourneyEngine();
    const plans = engine.planMultimodalJourneys({
      originId: origin,
      destinationId: destination,
      preference: preference || undefined,
      requireStepFree: stepFree,
    });

    return NextResponse.json({
      success: true,
      query: { origin, destination, preference, stepFree },
      generatedAt: new Date().toISOString(),
      planCount: plans.length,
      plans,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error generating multimodal journey plans:', error);
    return NextResponse.json(
      {
        error: 'Failed to compute multimodal journey plan',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

