import { NextResponse } from "next/server";
import {
  addUserToGroup,
  getMembersByGroup,
} from "@/services/access_group_user.service";

export async function GET(req: Request, context: any) {
  try {
    const { params } = await context;
    const members = await getMembersByGroup(params.id);
    return NextResponse.json({ success: true, data: members });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

export async function POST(req: Request, context: any) {
  try {
    const { params } = await context;
    const body = await req.json();

    // Basic validations
    if (!params || !params.id) {
      return NextResponse.json({ success: false, error: "Missing group id in route params" }, { status: 400 });
    }

    if (!body || !body.id_user) {
      return NextResponse.json({ success: false, error: "id_user is required" }, { status: 400 });
    }

    // Try to add user to group and capture DB errors
    try {
      const created = await addUserToGroup({
        id_user: body.id_user,
        id_access_group: params.id,
        admin: body.admin ?? false,
        created_by: typeof body.created_by !== 'undefined' ? body.created_by : undefined,
      });

      return NextResponse.json({ success: true, data: created });
    } catch (dbErr: any) {
      console.error("Error adding user to group:", dbErr);
      return NextResponse.json({ success: false, error: dbErr?.message || String(dbErr) }, { status: 500 });
    }
  } catch (err: any) {
    console.error("Members route POST error:", err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
