import { NextResponse } from 'next/server';
import { researchPilotService } from '@/lib/pilot/researchPilotService';

export async function GET() {
  try {
    const protocol = researchPilotService.getProtocol();

    return NextResponse.json({
      success: true,
      protocol,
      invariant: 'READ-ONLY + PASSIVE + ADVISORY',
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error fetching research pilot protocol:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve research pilot protocol',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
