import { NextRequest, NextResponse } from 'next/server';
import { getModelRegistryService } from '@/lib/ml/modelRegistry';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');
    const service = getModelRegistryService();

    if (modelId) {
      const model = service.getModelById(modelId);
      if (!model) {
        return NextResponse.json(
          { error: `Model with ID ${modelId} not found in registry` },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        model,
      });
    }

    const catalog = service.getCatalog();
    return NextResponse.json({
      success: true,
      ...catalog,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) throw error;
    console.error('Error fetching ML model registry:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve ML model registry',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
