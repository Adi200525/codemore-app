import { CATEGORIES, CATEGORY_MAP, demoProducts, slugify, type Product, type CategoryId, type Lang } from "./demo-data";
import { supabaseAdmin, supabasePublic } from "./supabase/admin";

export { CATEGORIES, CATEGORY_MAP };
export type { Product, CategoryId, Lang };

export type SortKey = "popular" | "new" | "price-asc" | "price-desc" | "rating";
export const SORTS: SortKey[] = ["popular", "new", "price-asc", "price-desc", "rating"];

export type Query = {
  q?: string;
  category?: string;
  sort?: SortKey;
  min?: number; // dollarda
  max?: number; // dollarda
  page?: number;
  per?: number;
};

type Index = {
  all: Product[];
  bySlug: Map<string, Product>;
  byId: Map<string, Product>;
  hay: Map<string, string>;
  sorted: Record<SortKey, Product[]>;
  counts: Record<string, number>;
  version: number;
};

let realCache: { at: number; items: Product[] } | null = null;
let indexCache: Index | null = null;

// Supabase'dagi HAQIQIY mahsulotlar (admin paneldan qo'shilganlar).
async function loadReal(): Promise<Product[]> {
  if (realCache && Date.now() - realCache.at < 60_000) return realCache.items;
  let items: Product[] = [];
  try {
    const sb = supabaseAdmin() ?? supabasePublic();
    if (sb) {
      const { data } = await sb
        .from("products")
        .select("id, slug, title, description, category, price_cents, cover_url, file_path, tags, formats, license, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(5000);
      items = (data ?? []).map((row: any) => ({
        id: String(row.id),
        slug: row.slug || `${slugify(row.title)}-${String(row.id).slice(0, 6)}`,
        name: row.title,
        category: (CATEGORY_MAP[row.category] ? row.category : "code") as CategoryId,
        priceCents: row.price_cents,
        rating: 0,
        reviews: 0,
        sales: 0,
        updatedAt: String(row.created_at).slice(0, 10),
        tags: row.tags ?? [],
        formats: row.formats ?? "",
        files: 1,
        sizeMb: 0,
        license: row.license === "personal" ? "personal" : "commercial",
        desc: { uz: row.description ?? "", en: row.description ?? "" },
        demo: false,
        coverUrl: row.cover_url || undefined,
        filePath: row.file_path || undefined,
      }));
    }
  } catch {
    items = [];
  }
  realCache = { at: Date.now(), items };
  return items;
}

function build(real: Product[], version: number): Index {
  const all = [...real, ...demoProducts()];
  const bySlug = new Map<string, Product>();
  const byId = new Map<string, Product>();
  const hay = new Map<string, string>();
  const counts: Record<string, number> = {};
  for (const p of all) {
    bySlug.set(p.slug, p);
    byId.set(p.id, p);
    hay.set(p.id, `${p.name} ${p.tags.join(" ")} ${p.category} ${p.formats}`.toLowerCase());
    counts[p.category] = (counts[p.category] || 0) + 1;
  }
  const realFirst = (a: Product, b: Product) => Number(a.demo) - Number(b.demo);
  const sorted: Record<SortKey, Product[]> = {
    popular: [...all].sort((a, b) => realFirst(a, b) || b.sales - a.sales),
    new: [...all].sort((a, b) => realFirst(a, b) || (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0)),
    "price-asc": [...all].sort((a, b) => a.priceCents - b.priceCents),
    "price-desc": [...all].sort((a, b) => b.priceCents - a.priceCents),
    rating: [...all].sort((a, b) => realFirst(a, b) || b.rating - a.rating || b.reviews - a.reviews),
  };
  return { all, bySlug, byId, hay, sorted, counts, version };
}

async function index(): Promise<Index> {
  const real = await loadReal();
  const version = realCache ? realCache.at : 0;
  if (!indexCache || indexCache.version !== version) indexCache = build(real, version);
  return indexCache;
}

export async function queryProducts(qy: Query) {
  const ix = await index();
  const sort: SortKey = qy.sort && SORTS.includes(qy.sort) ? qy.sort : "popular";
  const per = Math.min(60, Math.max(1, qy.per ?? 24));
  const tokens = (qy.q ?? "").toLowerCase().split(/\s+/).filter(Boolean).slice(0, 6);
  const minC = qy.min != null && !Number.isNaN(qy.min) ? Math.round(qy.min * 100) : null;
  const maxC = qy.max != null && !Number.isNaN(qy.max) ? Math.round(qy.max * 100) : null;
  const cat = qy.category && CATEGORY_MAP[qy.category] ? qy.category : null;

  const out: Product[] = [];
  for (const p of ix.sorted[sort]) {
    if (cat && p.category !== cat) continue;
    if (minC != null && p.priceCents < minC) continue;
    if (maxC != null && p.priceCents > maxC) continue;
    if (tokens.length) {
      const h = ix.hay.get(p.id) as string;
      let ok = true;
      for (const t of tokens) if (!h.includes(t)) { ok = false; break; }
      if (!ok) continue;
    }
    out.push(p);
  }
  const total = out.length;
  const pages = Math.max(1, Math.ceil(total / per));
  const page = Math.min(pages, Math.max(1, Math.floor(qy.page ?? 1)));
  return { items: out.slice((page - 1) * per, page * per), total, pages, page, per, sort };
}

export async function getProductBySlug(slug: string) {
  return (await index()).bySlug.get(slug) ?? null;
}

export async function getProductById(id: string) {
  return (await index()).byId.get(id) ?? null;
}

export async function getProductsByIds(ids: string[]) {
  const ix = await index();
  return ids.map((id) => ix.byId.get(id)).filter(Boolean) as Product[];
}

export async function categoryCounts() {
  return (await index()).counts;
}

export async function topInCategory(category: string, n: number, excludeId?: string) {
  const ix = await index();
  const out: Product[] = [];
  for (const p of ix.sorted.popular) {
    if (p.category === category && p.id !== excludeId) out.push(p);
    if (out.length >= n) break;
  }
  return out;
}

export async function realProductList() {
  return (await loadReal()).slice();
}

export async function totalCount() {
  return (await index()).all.length;
}
