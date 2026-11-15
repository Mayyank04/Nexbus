import { NextResponse } from 'next/server';
import { getShadowOperationsEngine } from '@/lib/shadow/shadowOperationsEngine';

export async function GET() {
  const engine = getShadowOperationsEngine();
  const auditLog = engine.getAuditTrail();

  return NextResponse.json({
    success: true,
    count: auditLog.length,
    auditTrail: auditLog,
    complianceStatus: 'VERIFIED_READ_ONLY',
    nonInterventionAffirmation:
      'NEXBUS operates in isolated shadow mode. Physical transport signals, dispatchers, and vehicle CAN buses are not coupled.',
    timestamp: new Date().toISOString(),
  });
}
