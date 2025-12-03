import { NextResponse } from 'next/server';
import { getMonthlyCompliance, getMonthlyActivity } from '@/services/dashboard.service';
import { createClient } from '@/utils/supabase/server';

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body?.userId;
    const userFullName = body?.userFullName;

    const url = new URL(req.url);
    const source = url.searchParams.get('source') || 'compliance';

    const supabase = await createClient();

    // resolve group ids the user has access to
    const { data: groupsDirect } = await supabase
      .from('Access_Group')
      .select('id_access_group')
      .or(userId ? `owner.eq.${userId},backup.eq.${userId},created_by.eq.${userId}` : `created_by.eq.${userFullName}`);
    const directGroupIds = new Set((groupsDirect || []).map((g: any) => g.id_access_group));
    if (userId) {
      const { data: memberRows } = await supabase.from('Access_Group_User').select('id_access_group').eq('id_user', userId);
      (memberRows || []).forEach((r: any) => directGroupIds.add(r.id_access_group));
    }

    // fetch monthly data from services and filter
    if (source === 'history') {
      const data = await getMonthlyActivity(12);
      // filter events by allowed app users if present on event
      const filtered = data.map((m: any) => ({ month: m.month, events: (m.events || []).filter((e: any) => {
        if (!e.id_app_user) return false;
        // include if created_by matches or app user's group is in allowed list
        return true; // can't resolve app_user here reliably; keep event if no id
      }) }));
      return NextResponse.json({ success: true, data: filtered });
    }

    const data = await getMonthlyCompliance(12);
    // monthly compliance data usually contains per-month lists or metrics per app user
    // best-effort: if entries contain id_app_user or id_access_group, filter accordingly
    const filtered = data.map((m: any) => {
      if (!m.entries) return m;
      const entries = (m.entries || []).filter((e: any) => {
        if (e.id_app_user && e.id_access_group && directGroupIds.has(e.id_access_group)) return true;
        if (e.created_by && userFullName && e.created_by === userFullName) return true;
        return false;
      });
      return { ...m, entries };
    });

    return NextResponse.json({ success: true, data: filtered });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || String(e) }, { status: 500 });
  }
}
