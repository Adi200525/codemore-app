import { NextResponse } from "next/server";
import { getProductById } from "@/lib/catalog";
import { getUser } from "@/lib/auth";
import { canDownload } from "@/lib/entitlement";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SITE } from "@/lib/config";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  if (!user) return NextResponse.redirect(new URL(`/login?next=/api/download/${encodeURIComponent(id)}`, SITE.url));
  const p = await getProductById(id);
  if (!p) return new NextResponse("not found", { status: 404 });
  if (!(await canDownload(user.id, p.id))) return NextResponse.redirect(new URL(`/p/${p.slug}`, SITE.url));

  if (p.demo || !p.filePath) {
    const body = `${p.name}\n\nThis is a generated SAMPLE product. It contains no real files.\nBu namunaviy (demo) mahsulot — haqiqiy fayl emas.\n`;
    return new NextResponse(body, {
      headers: { "content-type": "text/plain; charset=utf-8", "content-disposition": `attachment; filename="${p.slug}.txt"` },
    });
  }
  const admin = supabaseAdmin();
  if (!admin) return new NextResponse("storage not configured", { status: 503 });
  const { data, error } = await admin.storage.from("products").createSignedUrl(p.filePath, 60, { download: true });
  if (error || !data) return new NextResponse("file unavailable", { status: 502 });
  return NextResponse.redirect(data.signedUrl);
}
