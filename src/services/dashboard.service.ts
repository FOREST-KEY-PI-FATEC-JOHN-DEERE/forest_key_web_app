import { supabase } from '@/utils/supabase/client';

function nowIso() {
  return new Date().toISOString();
}

export async function getExpiredUsers() {
  const now = nowIso();
  const { data, error } = await supabase
    .from('Application_User')
    .select('id_app_user, application_name, expire_at, created_by, changed_by')
    .not('expire_at', 'is', null)
    .lt('expire_at', now)
    .order('expire_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getNextDue(days = 30) {
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('Application_User')
    .select('id_app_user, application_name, expire_at, created_by, changed_by, last_update')
    .not('expire_at', 'is', null)
    .gte('expire_at', now.toISOString())
    .lte('expire_at', future)
    .order('expire_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getAverageNextRenewal() {
  const { data, error } = await supabase
    .from('Application_User')
    .select('expire_at')
    .not('expire_at', 'is', null);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return { averageDays: 0 };

  const now = Date.now();
  const deltas = data
    .map((r: any) => {
      const t = Date.parse(r.expire_at);
      return isNaN(t) ? null : t - now;
    })
    .filter((d: number | null) => d !== null) as number[];

  if (deltas.length === 0) return { averageDays: 0 };

  const avgMs = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const averageDays = Math.round(avgMs / (1000 * 60 * 60 * 24));
  return { averageDays };
}

export async function getRenewalCompliance() {
  // Compliance defined as percentage of users with expire_at in the future
  const { data, error } = await supabase.from('Application_User').select('id_app_user, expire_at').not('expire_at', 'is', null);
  if (error) throw new Error(error.message);
  const total = (data || []).length;
  if (total === 0) return { total: 0, compliant: 0, percent: 0 };
  const now = Date.now();
  const compliant = (data || []).filter((r: any) => r.expire_at && new Date(r.expire_at).getTime() > now).length;
  const percent = Math.round((compliant / total) * 100);
  return { total, compliant, percent };
}

export async function getTop5UserRisk() {
  // Top 5 users with the nearest expiration date
  const { data, error } = await supabase
    .from('Application_User')
    .select('id_app_user, application_name, expire_at, last_update, changed_by, created_by')
    .not('expire_at', 'is', null)
    .order('expire_at', { ascending: true })
    .limit(5);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getHistoryByUser(id_app_user: string) {
  const { data, error } = await supabase
    .from('History')
    .select('id_history, created_at, changed_by')
    .eq('id_app_user', id_app_user)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getPasswordStrengthMetric(daysThreshold = 90) {
  // Heuristic: users who updated password in the last `daysThreshold` days are considered "recently updated"
  const threshold = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('Application_User')
    .select('id_app_user, last_update')
    .not('last_update', 'is', null);

  if (error) throw new Error(error.message);
  const total = (data || []).length;
  if (total === 0) return { total: 0, recent: 0, percent: 0 };
  const recent = (data || []).filter((r: any) => {
    const t = Date.parse(r.last_update);
    return !isNaN(t) && new Date(t).toISOString() >= threshold;
  }).length;
  const percent = Math.round((recent / total) * 100);
  return { total, recent, percent };
}

export async function getMonthlyCompliance(months = 12) {
  // Returns an array of months with compliance percent calculated as
  // percentage of current users whose expire_at is after the end of that month.
  const { data, error } = await supabase.from('Application_User').select('id_app_user, expire_at');
  if (error) throw new Error(error.message);
  const rows = (data || []).filter((r: any) => r.expire_at);
  const total = rows.length;
  const now = new Date();
  const result: Array<{ month: string; percent: number; total: number; compliant: number }> = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    // month end: last millisecond of the month
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();
    const compliant = rows.filter((r: any) => {
      const t = Date.parse(r.expire_at);
      return !isNaN(t) && t > monthEnd;
    }).length;
    const percent = total === 0 ? 0 : Math.round((compliant / total) * 100);
    const label = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
    result.push({ month: label, percent, total, compliant });
  }
  return result;
}

export async function getMonthlyActivity(months = 12) {
  // Aggregate number of History events per month (simple event-count timeline)
  const { data, error } = await supabase.from('History').select('id_history, created_at, changed_by, id_app_user');
  if (error) throw new Error(error.message);
  const rows = data || [];
  const now = new Date();
  const buckets: Record<string, { month: string; events: number }> = {};
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
    buckets[label] = { month: label, events: 0 };
  }

  rows.forEach((r: any) => {
    if (!r.created_at) return;
    const t = Date.parse(r.created_at);
    if (isNaN(t)) return;
    const d = new Date(t);
    const label = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
    if (buckets[label]) buckets[label].events += 1;
  });

  return Object.values(buckets);
}