import { NextResponse } from "next/server";
import {createAccessGroup,getAllAccessGroups,} from "@/services/access_group.service";

export async function GET() {
  try {
    const data = await getAllAccessGroups();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Group name is required" },
        { status: 400 }
      );
    }

    const group = await createAccessGroup({
      name: body.name,
      description: body.description ?? null,
      created_by: body.created_by ?? null,
      owner: typeof body.owner !== 'undefined' ? body.owner : undefined,
      backup: typeof body.backup !== 'undefined' ? body.backup : undefined,
    });

    return NextResponse.json({ success: true, data: group });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
