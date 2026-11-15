import { NextResponse } from 'next/server';
import { getProvenanceService } from '@/lib/ingestion/provenanceService';
import { getDataQualityGovernor } from '@/lib/ingestion/dataQualityGovernor';
import { EVIDENCE_DATASET_REGISTRY, getDatasetQualityMetrics } from '@/lib/ingestion/evidenceRegistry';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const outputId = searchParams.get('outputId');

    const provenanceService = getProvenanceService();
    const governor = getDataQualityGovernor();

    if (outputId) {
      const lineageWithSources = provenanceService.getRecordWithSources(outputId);
      if (!lineageWithSources) {
        return NextResponse.json(
          { error: `Lineage record for output "${outputId}" not found` },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        lineage: lineageWithSources.record,
        underlyingDatasets: lineageWithSources.sources,
      });
    }

    const allLineages = provenanceService.getAllRecords();
    const qualityMetrics = getDatasetQualityMetrics();
    const governanceReport = governor.getGovernanceAuditReport();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      datasetCatalog: EVIDENCE_DATASET_REGISTRY,
      qualityMetrics,
      lineages: allLineages,
      failureTaxonomy: governanceReport.failureCategoryBreakdown,
      nonSubstitutionAudit: governanceReport.nonSubstitutionAudit,
      safetyInvariantNotice: governanceReport.safetyInvariantNotice,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error serving provenance API:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve evidence provenance metadata',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
