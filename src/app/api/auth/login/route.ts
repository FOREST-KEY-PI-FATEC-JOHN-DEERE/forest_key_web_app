import { supabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const userId = authData.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("User")
    .select("first_name, last_name")
    .eq("id_user", userId)
    .single();

  if (profileError) {
    return NextResponse.json(
      { error: "Failed to load user profile" },
      { status: 500 }
    );
  }

  const token = authData.session.access_token;

  // Criar resposta
  const res = NextResponse.json(
    {
      user: authData.user,
      profile,
      token,
    },
    { status: 200 }
  );

  res.cookies.set("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 86400,
});

  return res;
}
