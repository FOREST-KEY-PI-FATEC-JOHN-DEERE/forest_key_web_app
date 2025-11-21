import { deleteAppUser, getAppUserByID, updateAppUser } from "@/services/application_user.service";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: any) {
  try {
    const data = await getAppUserByID(params.id);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: any) {
  try {
    const body = await req.json();
    const data = await updateAppUser(params.id, body);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    await deleteAppUser(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
