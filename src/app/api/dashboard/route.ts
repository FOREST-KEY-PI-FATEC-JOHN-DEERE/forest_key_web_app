import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/*
  GET: legacy global metrics (keeps previous behavior by querying public client-side service)
  POST: accepts { userId, userFullName } and returns metrics scoped to the app users
        that the given user can access (created_by OR groups where user is owner/backup/created_by or member)
*/

export async function GET() {
  try {
    // fallback global behavior: reuse server client and compute global metrics
    const supabase = await createClient();

    const now = Date.now();

    const { data: allRows } = await supabase.from('Application_User').select('id_app_user, expire_at, last_update, application_name, created_by, changed_by');
    const rows = allRows || [];

    // compliance
    const total = rows.filter((r: any) => r.expire_at).length;
    const compliant = rows.filter((r: any) => r.expire_at && new Date(r.expire_at).getTime() > now).length;
    const percent = total === 0 ? 0 : Math.round((compliant / total) * 100);

    const compliance = { total, compliant, percent };

    // expired
    const expired = rows.filter((r: any) => r.expire_at && new Date(r.expire_at).getTime() < now).sort((a: any, b: any) => new Date(a.expire_at).getTime() - new Date(b.expire_at).getTime());

    // averageNext
    const expireRows = rows.filter((r: any) => r.expire_at).map((r: any) => Date.parse(r.expire_at)).filter((t: any) => !isNaN(t));
    const averageNext = (() => {
      if (expireRows.length === 0) return { averageDays: 0 };
      const nowMs = Date.now();
      const deltas = expireRows.map((t: number) => t - nowMs);
      const avgMs = deltas.reduce((s, v) => s + v, 0) / deltas.length;
      return { averageDays: Math.round(avgMs / (1000 * 60 * 60 * 24)) };
    })();

    // nextDue (30 days)
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const nextDue = rows.filter((r: any) => r.expire_at && new Date(r.expire_at).toISOString() >= new Date().toISOString() && r.expire_at <= future).sort((a: any, b: any) => new Date(a.expire_at).getTime() - new Date(b.expire_at).getTime());

    // top5
    const top5 = rows.filter((r: any) => r.expire_at).sort((a: any, b: any) => new Date(a.expire_at).getTime() - new Date(b.expire_at).getTime()).slice(0, 5);

    // passwordStrength (last_update heuristic)
    const lastUpdates = rows.filter((r: any) => r.last_update).map((r: any) => ({ id: r.id_app_user, last_update: r.last_update }));
    const totalLast = lastUpdates.length;
    const recent = lastUpdates.filter((r: any) => {
      const t = Date.parse(r.last_update);
      return !isNaN(t) && new Date(t).toISOString() >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    }).length;
    const passwordStrength = { total: totalLast, recent, percent: totalLast === 0 ? 0 : Math.round((recent / totalLast) * 100) };

    return NextResponse.json({ success: true, data: { compliance, expired, averageNext, nextDue, top5, passwordStrength } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body?.userId;
    const userFullName = body?.userFullName;

    if (!userId && !userFullName) {
      return NextResponse.json({ success: false, error: 'userId or userFullName required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get groups where user is owner/backup/created_by
    const { data: groupsDirect } = await supabase
      .from('Access_Group')
      .select('id_access_group')
      .or(userId ? `owner.eq.${userId},backup.eq.${userId},created_by.eq.${userId}` : `created_by.eq.${userFullName}`);

    const directGroupIds = new Set((groupsDirect || []).map((g: any) => g.id_access_group));

    // Get groups where user is member
    if (userId) {
      const { data: memberRows } = await supabase.from('Access_Group_User').select('id_access_group').eq('id_user', userId);
      (memberRows || []).forEach((r: any) => directGroupIds.add(r.id_access_group));
    }

    // Fetch app users filtered by created_by OR id_access_group in directGroupIds
    const { data: appUsers } = await supabase.from('Application_User').select('id_app_user, application_name, expire_at, last_update, created_by, changed_by, id_access_group');
    const rows = (appUsers || []).filter((u: any) => {
      if (userFullName && u.created_by === userFullName) return true;
      if (u.id_access_group && directGroupIds.has(u.id_access_group)) return true;
      return false;
    });

    const now = Date.now();

    // compliance
    const total = rows.filter((r: any) => r.expire_at).length;
    const compliant = rows.filter((r: any) => r.expire_at && new Date(r.expire_at).getTime() > now).length;
    const percent = total === 0 ? 0 : Math.round((compliant / total) * 100);
    const compliance = { total, compliant, percent };

    // expired
    const expired = rows.filter((r: any) => r.expire_at && new Date(r.expire_at).getTime() < now).sort((a: any, b: any) => new Date(a.expire_at).getTime() - new Date(b.expire_at).getTime());

    // averageNext
    const expireRows = rows.filter((r: any) => r.expire_at).map((r: any) => Date.parse(r.expire_at)).filter((t: any) => !isNaN(t));
    const averageNext = (() => {
      if (expireRows.length === 0) return { averageDays: 0 };
      const nowMs = Date.now();
      const deltas = expireRows.map((t: number) => t - nowMs);
      const avgMs = deltas.reduce((s, v) => s + v, 0) / deltas.length;
      return { averageDays: Math.round(avgMs / (1000 * 60 * 60 * 24)) };
    })();

    // nextDue (30 days)
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const nextDue = rows.filter((r: any) => r.expire_at && new Date(r.expire_at).toISOString() >= new Date().toISOString() && r.expire_at <= future).sort((a: any, b: any) => new Date(a.expire_at).getTime() - new Date(b.expire_at).getTime());

    // top5
    const top5 = rows.filter((r: any) => r.expire_at).sort((a: any, b: any) => new Date(a.expire_at).getTime() - new Date(b.expire_at).getTime()).slice(0, 5);

    // passwordStrength (last_update heuristic)
    const lastUpdates = rows.filter((r: any) => r.last_update).map((r: any) => ({ id: r.id_app_user, last_update: r.last_update }));
    const totalLast = lastUpdates.length;
    const recent = lastUpdates.filter((r: any) => {
      const t = Date.parse(r.last_update);
      return !isNaN(t) && new Date(t).toISOString() >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    }).length;
    const passwordStrength = { total: totalLast, recent, percent: totalLast === 0 ? 0 : Math.round((recent / totalLast) * 100) };

    return NextResponse.json({ success: true, data: { compliance, expired, averageNext, nextDue, top5, passwordStrength } });
  } catch (err: any) {
    console.error('Error in dashboard POST', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
