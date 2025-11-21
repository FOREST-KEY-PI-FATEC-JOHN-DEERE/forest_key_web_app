import { createAppUser, getAllAppUsers } from "@/services/application_user.service";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const users = await getAllAppUsers();
    return NextResponse.json({ success: true, data: users });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await createAppUser(body);
    return NextResponse.json({ success: true, data: user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
