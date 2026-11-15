import { NextResponse } from 'next/server';
import { getShadowOperationsEngine } from '@/lib/shadow/shadowOperationsEngine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const corridorId = searchParams.get('corridorId');

  const engine = getShadowOperationsEngine();

  if (corridorId) {
    const state = engine.getCorridorState(corridorId);
    if (!state) {
      return NextResponse.json(
        { success: false, error: `Corridor ${corridorId} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      corridor: state,
      timestamp: new Date().toISOString(),
      advisoryNotice: 'Shadow operation mode. Read-only intelligence. Does not control dispatch.',
    });
  }

  const allStates = engine.getAllCorridorStates();
  return NextResponse.json({
    success: true,
    count: allStates.length,
    corridors: allStates,
    timestamp: new Date().toISOString(),
    advisoryNotice: 'This is an advisory shadow-operation system. It does not control vehicles, dispatch, signals or transport infrastructure.',
  });
}
