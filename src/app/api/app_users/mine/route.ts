import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body?.userId;
    const userFullName = body?.userFullName;

    if (!userId && !userFullName) {
      return NextResponse.json({ success: false, error: 'userId or userFullName is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch all app users
    const { data: appUsers, error: appErr } = await supabase
      .from('Application_User')
      .select('*');

    if (appErr) throw appErr;

    // Find groups the user is owner/backup/created_by
    const { data: groupsDirect, error: groupsErr } = await supabase
      .from('Access_Group')
      .select('id_access_group')
      .or(userId ? `owner.eq.${userId},backup.eq.${userId},created_by.eq.${userId}` : `created_by.eq.${userFullName}`);

    if (groupsErr) throw groupsErr;

    const directGroupIds = new Set((groupsDirect || []).map((g: any) => g.id_access_group));

    // Find groups where user is a member
    const { data: memberRows, error: memberErr } = await supabase
      .from('Access_Group_User')
      .select('id_access_group')
      .eq('id_user', userId);

    if (memberErr) throw memberErr;

    for (const r of (memberRows || [])) directGroupIds.add(r.id_access_group);

    // Filter app users: either created_by matches userFullName OR id_access_group in directGroupIds
    const filtered = (appUsers || []).filter((u: any) => {
      if (userFullName && u.created_by === userFullName) return true;
      if (u.id_access_group && directGroupIds.has(u.id_access_group)) return true;
      return false;
    });

    return NextResponse.json({ success: true, data: filtered });
  } catch (err: any) {
    console.error('Error fetching user app users', err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
