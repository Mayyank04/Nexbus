import { NextResponse } from 'next/server';
import { DELHI_CORRIDORS, HOURLY_FLOW_DATA, DELHI_STOPS } from '@/data/delhiTransitData';
import { DATA_PROVENANCE_REGISTRY } from '@/data/provenanceRegistry';
import { ML_VALIDATION_DOSSIER } from '@/lib/mlEvaluation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'corridors';

  if (type === 'hourly') {
    const headers = 'Hour,Load_Percentage,Estimated_Passengers,Confidence_Score,Data_Tier\n';
    const rows = HOURLY_FLOW_DATA.map(
      (h) => `${h.hour},${h.load},${h.passengers},${h.confidence}%,ESTIMATED`
    ).join('\n');

    return new Response(headers + rows, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="nexbus_hourly_demand_profile.csv"',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }

  if (type === 'ml_validation') {
    const headers = 'Corridor_ID,Corridor_Name,Corridor_Type,MAE_Percentage_Points,RMSE_Percentage_Points,MAPE_Pct,PICP_80_Pct,PICP_95_Pct,Peak_Hour_Bias\n';
    const rows = ML_VALIDATION_DOSSIER.corridorBreakdown.map(
      (c) => `"${c.corridorId}","${c.corridorName}","${c.corridorType}",${c.metrics.mae},${c.metrics.rmse},${c.metrics.mape},${c.metrics.picp80 || 'N/A'},${c.metrics.picp95 || 'N/A'},${c.peakHourBiasPct}%`
    ).join('\n');

    return new Response(headers + rows, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="nexbus_ml_model_evaluation.csv"',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }

  // Default: Corridors and Fleet Overview
  const headers = 'Corridor_ID,Corridor_Name,Code,Type,Length_Km,Daily_Passengers,Buses_Per_Hour,Avg_Speed_KmH,Punctuality_Pct,Status,Data_Tier\n';
  const rows = DELHI_CORRIDORS.map(
    (c) =>
      `"${c.id}","${c.name}","${c.code}","${c.type}",${c.lengthKm},${c.dailyPassengers},${c.busesPerHour},${c.averageSpeedKmH},${c.currentPunctuality},"${c.status}",OBSERVED_AND_ESTIMATED`
  ).join('\n');

  return new Response(headers + rows, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="nexbus_delhi_corridor_intelligence.csv"',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
