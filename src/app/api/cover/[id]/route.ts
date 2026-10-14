import { NextResponse } from "next/server";
import { getProductById, CATEGORY_MAP } from "@/lib/catalog";
import { coverSvg } from "@/lib/cover";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProductById(id);
  if (!p) return new NextResponse("not found", { status: 404 });
  if (p.coverUrl) return NextResponse.redirect(p.coverUrl);
  const svg = coverSvg(p, CATEGORY_MAP[p.category].en);
  return new NextResponse(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
