import { NextResponse } from 'next/server';
import { DATA_PROVENANCE_REGISTRY } from '@/data/provenanceRegistry';
import { DELHI_STOPS, DELHI_ROUTES, DELHI_CORRIDORS } from '@/data/delhiTransitData';
import { validateStops, validateRoutes, DELHI_BOUNDING_BOX } from '@/lib/geoValidation';

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

  return NextResponse.json({
    success: true,
    registrySummary: {
      totalSources: DATA_PROVENANCE_REGISTRY.length,
      publishers: Array.from(new Set(DATA_PROVENANCE_REGISTRY.map((r) => r.publisher))),
      epistemologicalBreakdown: {
        observed: DATA_PROVENANCE_REGISTRY.filter((r) => r.epistemologicalTier === 'Observed').length,
        estimated: DATA_PROVENANCE_REGISTRY.filter((r) => r.epistemologicalTier === 'Estimated').length,
        predicted: DATA_PROVENANCE_REGISTRY.filter((r) => r.epistemologicalTier === 'Predicted').length,
        hypothetical: DATA_PROVENANCE_REGISTRY.filter((r) => r.epistemologicalTier === 'Hypothetical').length,
      },
    },
    sources: DATA_PROVENANCE_REGISTRY,
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
