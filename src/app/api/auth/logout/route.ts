import { supabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function POST() {
  await supabase.auth.signOut();

  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("token", "", { maxAge: 0 });

  return response;
}