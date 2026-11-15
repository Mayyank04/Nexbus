import { NextResponse } from 'next/server';
import { ML_VALIDATION_DOSSIER } from '@/lib/mlEvaluation';

export async function GET() {
  return NextResponse.json({
    success: true,
    evaluation: ML_VALIDATION_DOSSIER,
    timestamp: new Date().toISOString(),
  });
}
