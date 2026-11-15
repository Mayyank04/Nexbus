import { NextResponse } from 'next/server';
import { DELHI_CORRIDORS, HOURLY_FLOW_DATA, DELHI_STOPS } from '@/data/delhiTransitData';
import { DATA_PROVENANCE_REGISTRY } from '@/data/provenanceRegistry';
import { ML_VALIDATION_DOSSIER } from '@/lib/mlEvaluation';
import { getShadowOperationsEngine } from '@/lib/shadow/shadowOperationsEngine';
import { getObservationLedger } from '@/lib/ingestion/observationLedger';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'corridors';

  if (type === 'shadow-audit') {
    const engine = getShadowOperationsEngine();
    const states = engine.getAllCorridorStates();
    const headers = 'Corridor_ID,Corridor_Name,Last_Updated,Observed_Vehicles,Avg_Speed_Kmph,Congestion_Index_Pct,Est_Headway_Min,Sched_Headway_Min,Headway_Regularity_Pct,Current_Crowd_Pct,Predicted_Crowd_30m,Confidence_Pct,Epistemological_State\n';
    const rows = states.map(
      (s) => `"${s.corridorId}","${s.corridorName}","${s.lastUpdated}",${s.activeObservedVehiclesCount},${s.averageSpeedKmph},${s.congestionIndexPct}%,${s.estimatedHeadwayMin},${s.scheduledHeadwayMin},${s.headwayRegularityScorePct}%,${s.currentEstimatedCrowdPct}%,${s.predictedCrowdNext30MinPct}%,${s.confidenceScorePct}%,"${s.epistemologicalState}"`
    ).join('\n');

    return new Response(headers + rows, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="nexbus_shadow_operations_audit.csv"',
        'Cache-Control': 'no-store',
      },
    });
  }

  if (type === 'data-quality') {
    const ledger = getObservationLedger();
    const metrics = ledger.getMetrics();
    const health = ledger.getSourceHealth();
    const headers = 'Source_ID,Source_Name,Status,Latency_Ms,Records_Ingested,Last_Success\n';
    const rows = health.map(
      (h) => `"${h.sourceId}","${h.sourceName}","${h.status}",${h.latencyMs},${h.totalRecordsIngested},"${h.lastSuccessAt || 'NONE'}"`
    ).join('\n');

    return new Response(headers + rows, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="nexbus_data_quality_report.csv"',
        'Cache-Control': 'no-store',
      },
    });
  }

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
