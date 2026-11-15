import { NextRequest, NextResponse } from 'next/server';
import { getScenarioPlanningService } from '@/lib/simulation/scenarioPlanningService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('interventions');
    const selectedIds = idsParam ? idsParam.split(',').map((s) => s.trim()).filter(Boolean) : undefined;

    const service = getScenarioPlanningService();
    const report = service.compareInterventions(selectedIds);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error fetching scenario planning report:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve scenario planning report',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const selectedIds: string[] | undefined = body.selectedInterventionIds;

    const service = getScenarioPlanningService();
    const report = service.compareInterventions(selectedIds);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('Error processing scenario planning evaluation:', error);
    return NextResponse.json(
      {
        error: 'Invalid request body or scenario planning evaluation failure',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}
