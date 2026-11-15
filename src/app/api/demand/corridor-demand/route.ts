import { NextRequest, NextResponse } from 'next/server';
import { getPassengerDemandService } from '@/lib/demand/passengerDemandService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const corridorId = searchParams.get('corridorId');
    const dayType = (searchParams.get('dayType') as 'weekday' | 'weekend') || 'weekday';
    const synthetic = searchParams.get('synthetic') === 'true';

    const service = getPassengerDemandService();

    if (corridorId) {
      const demand = service.getCorridorDemand(corridorId, dayType, synthetic);
      return NextResponse.json({
        success: true,
        demand,
      });
    }

    const summary = service.getNetworkDemandSummary(dayType, synthetic);
    return NextResponse.json({
      success: true,
      ...summary,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error fetching corridor passenger demand:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve passenger demand analytics',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
