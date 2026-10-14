// Katalog generatorini tekshiradi: node --experimental-strip-types scripts/check-catalog.mjs (Node 22.6+)
import { demoProducts, CATEGORIES } from "../src/lib/demo-data.ts";
import { coverSvg } from "../src/lib/cover.ts";

const list = demoProducts();
const fail = (m) => { console.error("FAIL:", m); process.exit(1); };
if (list.length !== 30000) fail(`expected 30000, got ${list.length}`);
const slugs = new Set(list.map((p) => p.slug));
const ids = new Set(list.map((p) => p.id));
if (slugs.size !== list.length) fail("duplicate slugs");
if (ids.size !== list.length) fail("duplicate ids");
const names = new Set();
for (const c of CATEGORIES) {
  const inCat = list.filter((p) => p.category === c.id);
  if (inCat.length !== c.count) fail(`${c.id} count`);
  const n = new Set(inCat.map((p) => p.name));
  if (n.size !== inCat.length) fail(`${c.id} duplicate names (${n.size}/${inCat.length})`);
}
for (const p of list) {
  if (!p.demo || p.priceCents < 100 || !p.desc.uz || !p.desc.en) fail(`bad product ${p.id}`);
}
for (let i = 0; i < list.length; i += 997) {
  const p = list[i];
  const svg = coverSvg(p, p.category);
  if (!svg.startsWith("<svg") || !svg.trim().endsWith("</svg>")) fail(`cover ${p.id}`);
}
console.log("OK: 30000 products, unique slugs/ids/names per category, covers valid");
