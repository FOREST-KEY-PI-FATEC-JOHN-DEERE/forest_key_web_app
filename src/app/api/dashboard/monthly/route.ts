import { NextResponse } from 'next/server';
import { getMonthlyCompliance, getMonthlyActivity } from '@/services/dashboard.service';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const source = url.searchParams.get('source') || 'compliance';
    if (source === 'history') {
      const data = await getMonthlyActivity(12);
      return NextResponse.json({ success: true, data });
    }
    const data = await getMonthlyCompliance(12);
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || String(e) }, { status: 500 });
  }
}
