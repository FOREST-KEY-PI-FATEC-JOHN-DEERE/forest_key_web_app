import { NextResponse } from "next/server";
import { removeUserFromGroup } from "@/services/access_group_user.service";

interface Params {
  params: { id: string; membersId: string };
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { membersId } = params;

    if (!membersId) {
      return NextResponse.json({ success: false, error: "Missing member id in route params" }, { status: 400 });
    }

    try {
      await removeUserFromGroup(membersId);
      return NextResponse.json({ success: true, data: { id: membersId } });
    } catch (err: any) {
      console.error("Error removing group member:", err);
      return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
    }
  } catch (err: any) {
    console.error("Members delete route error:", err);
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 });
  }
}
