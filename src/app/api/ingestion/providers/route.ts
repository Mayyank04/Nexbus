import { NextRequest, NextResponse } from 'next/server';
import { providerRegistry } from '@/lib/ingestion/providers/providerRegistry';
import { rawArchiveService } from '@/lib/ingestion/rawArchiveService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const verifyArchiveId = searchParams.get('verifyArchive');

    // On-demand cryptographic verification check
    if (verifyArchiveId) {
      const verification = rawArchiveService.verifyIntegrity(verifyArchiveId);
      return NextResponse.json({
        success: true,
        verification,
      });
    }

    const summary = providerRegistry.getRegistrySummary();
    const archives = rawArchiveService.getAllArchives();

    return NextResponse.json({
      success: true,
      summary,
      archives,
      invariant: 'READ-ONLY + PASSIVE + ADVISORY',
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error fetching provider registry summary:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve transport provider registry',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { providerId } = body;

    if (providerId) {
      const result = await providerRegistry.syncProvider(providerId);
      return NextResponse.json({
        success: true,
        providerId,
        result,
      });
    }

    const updatedSummary = await providerRegistry.syncAll();
    return NextResponse.json({
      success: true,
      action: 'SYNC_ALL',
      summary: updatedSummary,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error synchronizing transport providers:', error);
    return NextResponse.json(
      {
        error: 'Failed to synchronize provider feeds',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
