import { NextResponse } from 'next/server';
import { getDataQualityGovernor } from '@/lib/ingestion/dataQualityGovernor';

export async function GET() {
  try {
    const governor = getDataQualityGovernor();
    const report = governor.getGovernanceAuditReport();

    return NextResponse.json({
      success: true,
      governance: report,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error generating governance audit report:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate data governance audit report',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
