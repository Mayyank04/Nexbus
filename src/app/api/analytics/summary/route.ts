import { NextResponse } from 'next/server';
import { DELHI_CORRIDORS, DELHI_STOPS, HOURLY_FLOW_DATA } from '@/data/delhiTransitData';

export async function GET() {
  const weekdayHourly = HOURLY_FLOW_DATA;
  const weekendHourly = HOURLY_FLOW_DATA.map((d) => ({
    ...d,
    load: Math.round(d.load * 0.74),
    passengers: Math.round(d.passengers * 0.72),
  }));

  const corridorRankings = [...DELHI_CORRIDORS].sort(
    (a, b) => b.dailyPassengers - a.dailyPassengers
  );

  const dwellBottlenecks = [...DELHI_STOPS]
    .sort((a, b) => b.dailyFootfall - a.dailyFootfall)
    .slice(0, 5)
    .map((s) => ({
      stopId: s.id,
      name: s.name,
      zone: s.zone,
      dailyFootfall: s.dailyFootfall,
      avgDwellTimeSeconds: 42 + Math.round((s.dailyFootfall / 100000) * 12),
      severity: s.crowdingLevel,
    }));

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        totalDailyPassengers: 4280000,
        networkPunctualityPct: 81.4,
        forecastFidelityPct: 94.8,
        activeElectricFleet: 1640,
        totalConnectedBuses: 3840,
        totalMonitoredStops: 4620,
      },
      temporalDemand: {
        weekday: weekdayHourly,
        weekend: weekendHourly,
      },
      corridorRankings,
      dwellBottlenecks,
      systemHealth: {
        avlBeaconSyncPct: 99.4,
        gtfsRtFeedLatencySeconds: 3.2,
        etmFareSyncRatePct: 98.7,
        odMatrixValidationScore: 0.942,
      },
    },
  });
}
