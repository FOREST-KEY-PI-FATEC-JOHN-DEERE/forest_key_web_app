// app/api/profile/route.ts
import { updateProfile } from "@/services/profile.service";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");  // get ?id=...
    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const updated = await updateProfile(id, body);

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
