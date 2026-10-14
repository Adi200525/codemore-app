import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { realProductList } from "@/lib/catalog";

// Demo mahsulotlar sitemap'ga kiritilmaydi (30 000 ta namunaviy sahifa qidiruvni to'ldirib yubormasligi uchun).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const real = await realProductList();
  const base = ["", "/catalog", "/premium", "/legal/terms", "/legal/privacy", "/legal/refund"].map((p) => ({ url: `${SITE.url}${p}` }));
  return [...base, ...real.map((p) => ({ url: `${SITE.url}/p/${p.slug}`, lastModified: p.updatedAt }))];
}
