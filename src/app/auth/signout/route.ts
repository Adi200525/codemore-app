import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { SITE } from "@/lib/config";

export async function POST() {
  const sb = await supabaseServer();
  if (sb) await sb.auth.signOut();
  return NextResponse.redirect(new URL("/", SITE.url), { status: 303 });
}
