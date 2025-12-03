import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body?.userId;

    if (!userId) return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });

    const supabase = await createClient();

    // Groups where user is owner/backup/created_by
    const { data: groupsDirect, error: directErr } = await supabase
      .from('Access_Group')
      .select('id_access_group, name, description, created_at, created_by, owner, backup');

    if (directErr) throw directErr;

    // Groups where user is a member
    const { data: memberRows, error: memberErr } = await supabase
      .from('Access_Group_User')
      .select('id_access_group, id_user')
      .eq('id_user', userId);

    if (memberErr) throw memberErr;

    const memberGroupIds = new Set((memberRows || []).map((r: any) => r.id_access_group));

    const filtered = (groupsDirect || []).filter((g: any) => g.owner === userId || g.backup === userId || g.created_by === userId || memberGroupIds.has(g.id_access_group));

    return NextResponse.json({ success: true, data: filtered });
  } catch (err: any) {
    console.error('Error fetching user groups', err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
