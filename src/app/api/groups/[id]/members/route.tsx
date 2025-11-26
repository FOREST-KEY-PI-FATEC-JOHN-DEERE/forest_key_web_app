import { NextResponse } from "next/server";
import {
  addUserToGroup,
  getMembersByGroup,
} from "@/services/access_group_user.service";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const members = await getMembersByGroup(params.id);
    return NextResponse.json({ success: true, data: members });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const body = await req.json();

    if (!body.id_user) {
      return NextResponse.json(
        { success: false, error: "id_user is required" },
        { status: 400 }
      );
    }

    const created = await addUserToGroup({
      id_user: body.id_user,
      id_access_group: params.id,
      admin: body.admin ?? false,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
