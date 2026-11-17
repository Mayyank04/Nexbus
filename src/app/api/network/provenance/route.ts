import { NextResponse } from 'next/server';
import { DATA_PROVENANCE_REGISTRY } from '@/data/provenanceRegistry';
import { DELHI_STOPS, DELHI_ROUTES, DELHI_CORRIDORS } from '@/data/delhiTransitData';
import { validateStops, validateRoutes, DELHI_BOUNDING_BOX } from '@/lib/geoValidation';
import { evaluateFreshness, EvidenceClassification } from '@/lib/evidence/evidenceClassification';

export async function GET() {
  const stopValidationIssues = validateStops(
    DELHI_STOPS.map((s) => ({
      id: s.id,
      name: s.name,
      coordinatesWgs84: s.coordinatesWgs84,
    }))
  );

  const validStopIds = new Set(DELHI_STOPS.map((s) => s.id));
  const routeValidationIssues = validateRoutes(DELHI_ROUTES, validStopIds);

  const allIssues = [...stopValidationIssues, ...routeValidationIssues];
  const errorsCount = allIssues.filter((i) => i.severity === 'ERROR').length;
  const warningsCount = allIssues.filter((i) => i.severity === 'WARNING').length;

  const sourcesWithFreshness = DATA_PROVENANCE_REGISTRY.map((source) => {
    const freshness = evaluateFreshness(source.lastRetrievalTimestamp, source.freshnessCategory);
    return {
      ...source,
      freshnessStatus: freshness.status,
      dataAgeSeconds: freshness.ageSeconds,
    };
  });

  const classificationCounts: Record<EvidenceClassification, number> = {
    OBSERVED: 0,
    VERIFIED_EXTERNAL: 0,
    DERIVED: 0,
    ESTIMATED: 0,
    PREDICTED: 0,
    SIMULATED: 0,
    SYNTHETIC: 0,
    UNAVAILABLE: 0,
    AUTH_REQUIRED: 0,
  };

  for (const s of DATA_PROVENANCE_REGISTRY) {
    if (s.evidenceClassification && classificationCounts[s.evidenceClassification] !== undefined) {
      classificationCounts[s.evidenceClassification]++;
    }
  }

  return NextResponse.json({
    success: true,
    safetyInvariant: 'READ-ONLY + PASSIVE + ADVISORY',
    registrySummary: {
      totalSources: DATA_PROVENANCE_REGISTRY.length,
      publishers: Array.from(new Set(DATA_PROVENANCE_REGISTRY.map((r) => r.publisher))),
      epistemologicalBreakdown: {
        observed: DATA_PROVENANCE_REGISTRY.filter((r) => r.epistemologicalTier === 'Observed').length,
        estimated: DATA_PROVENANCE_REGISTRY.filter((r) => r.epistemologicalTier === 'Estimated').length,
        predicted: DATA_PROVENANCE_REGISTRY.filter((r) => r.epistemologicalTier === 'Predicted').length,
        hypothetical: DATA_PROVENANCE_REGISTRY.filter((r) => r.epistemologicalTier === 'Hypothetical').length,
      },
      evidenceClassificationBreakdown: classificationCounts,
    },
    sources: sourcesWithFreshness,
    networkValidation: {
      isValid: errorsCount === 0,
      boundingBox: DELHI_BOUNDING_BOX,
      totalStopsValidated: DELHI_STOPS.length,
      totalRoutesValidated: DELHI_ROUTES.length,
      totalCorridorsValidated: DELHI_CORRIDORS.length,
      errorsCount,
      warningsCount,
      issues: allIssues,
      validatedAt: new Date().toISOString(),
    },
  });
}
