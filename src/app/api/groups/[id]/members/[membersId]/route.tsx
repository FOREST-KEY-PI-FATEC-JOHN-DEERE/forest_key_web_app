import { NextResponse } from "next/server";
import { removeUserFromGroup } from "@/services/access_group_user.service";

interface Params {
  params: { id: string; memberId: string };
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { memberId } = params;
    await removeUserFromGroup(memberId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
