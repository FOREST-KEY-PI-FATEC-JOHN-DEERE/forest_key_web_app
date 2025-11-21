import { supabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { firstName, lastName, email, password } = await req.json();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const { error: insertError } = await supabase.from("User").insert({
    id_user: authData.user?.id,
    first_name: firstName,
    last_name: lastName
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
