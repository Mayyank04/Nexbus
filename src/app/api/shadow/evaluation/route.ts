import { NextResponse } from 'next/server';
import { evaluateShadowPredictions } from '@/lib/shadow/predictionMonitor';

export async function GET() {
  const evaluation = evaluateShadowPredictions();

  return NextResponse.json({
    success: true,
    evaluation,
    methodology: {
      framework: 'Online Continuous Validation (TRB / IEEE Standards)',
      errorMetrics: ['MAE', 'RMSE', 'WAPE', 'MAPE-Epsilon', 'PICP-95', 'PINAW-95'],
      temporalPartitioning: 'Strict causal time horizon cutoff (no future lookahead)',
    },
    timestamp: new Date().toISOString(),
  });
}
