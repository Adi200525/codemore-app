// 30 000 ta NAMUNAVIY (DEMO) raqamli mahsulot generatori.
// Bular haqiqiy fayllar emas: nomlar, narxlar va tavsiflar qoida asosida yaratiladi (har safar bir xil natija).
// Haqiqiy mahsulotlar Supabase'dagi `products` jadvaliga /admin orqali qo'shiladi.

export type Lang = "uz" | "en";
export type CategoryId =
  | "ui-kits"
  | "web-templates"
  | "code"
  | "ebooks"
  | "icons"
  | "workspace"
  | "slides"
  | "courses";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  priceCents: number;
  rating: number; // 0 = baholanmagan
  reviews: number;
  sales: number;
  updatedAt: string; // YYYY-MM-DD
  tags: string[];
  formats: string;
  files: number;
  sizeMb: number;
  license: "personal" | "commercial";
  desc: { uz: string; en: string };
  demo: boolean;
  coverUrl?: string;
  filePath?: string;
};

type Cat = {
  id: CategoryId;
  uz: string;
  en: string;
  count: number;
  minUsd: number;
  maxUsd: number;
  formats: string[];
  nouns: string[];
  tags: string[];
  introUz: string[];
  introEn: string[];
  facts: (r: () => number) => { uz: string[]; en: string[]; files: number; sizeMb: number };
};

const pick = <T,>(r: () => number, arr: T[]): T => arr[Math.floor(r() * arr.length)];
const between = (r: () => number, a: number, b: number) => a + Math.floor(r() * (b - a + 1));

export const CATEGORIES: Cat[] = [
  {
    id: "ui-kits",
    uz: "UI kitlar",
    en: "UI kits",
    count: 4800,
    minUsd: 19,
    maxUsd: 89,
    formats: ["Figma", "Figma · Sketch", "Figma · XD"],
    nouns: [
      "Dashboard UI Kit", "Mobile App UI Kit", "E-commerce UI Kit", "Admin Panel UI Kit",
      "Fintech App UI Kit", "Landing Page UI Kit", "Social App UI Kit", "Wireframe Kit",
      "Design System", "Onboarding Screens", "Chat App UI Kit", "Calendar UI Kit",
    ],
    tags: ["figma", "sketch", "dashboard", "mobile", "dark mode", "auto layout", "components", "wireframe", "design system", "fintech", "e-commerce", "saas"],
    introUz: [
      "Loyihani noldan chizmasdan boshlash o'rniga tayyor ekranlar va komponentlardan foydalaning.",
      "Dizayner va dasturchilar uchun izchil, sozlanuvchan interfeys to'plami.",
    ],
    introEn: [
      "Skip the blank canvas and start from ready-made screens and components.",
      "A consistent, customizable interface set for designers and developers.",
    ],
    facts: (r) => {
      const s = between(r, 24, 160), c = between(r, 80, 600);
      return {
        uz: [`${s} ta ekran`, `${c} dan ortiq komponent`, "Auto layout va uslub (style) tizimi", "Och va qorong'i rejim"],
        en: [`${s} screens`, `${c}+ components`, "Auto layout and a style system", "Light and dark modes"],
        files: between(r, 1, 4),
        sizeMb: between(r, 12, 180),
      };
    },
  },
  {
    id: "web-templates",
    uz: "Veb shablonlar",
    en: "Website templates",
    count: 5100,
    minUsd: 29,
    maxUsd: 129,
    formats: ["HTML · CSS · JS", "Next.js · Tailwind", "React · CSS", "HTML · Tailwind"],
    nouns: [
      "Portfolio Template", "SaaS Landing Page", "Agency Website", "Restaurant Website",
      "Blog Theme", "Online Store Theme", "Documentation Site", "Real Estate Template",
      "Startup Landing Page", "Photography Portfolio", "Event Website", "Course Website",
    ],
    tags: ["html", "next.js", "tailwind", "responsive", "seo", "animation", "blog", "landing", "portfolio", "dark mode", "react", "cms"],
    introUz: [
      "Tayyor, tez yuklanadigan va telefonga moslashgan veb-sayt shabloni.",
      "Mijozga yoki o'zingizga bir kunda sayt chiqarish uchun to'liq shablon.",
    ],
    introEn: [
      "A ready, fast-loading and mobile-friendly website template.",
      "A complete template to ship a site for a client or yourself in a day.",
    ],
    facts: (r) => {
      const p = between(r, 5, 28);
      return {
        uz: [`${p} ta sahifa`, "Telefon, planshet va kompyuterga moslashgan", "SEO uchun tayyor tuzilma", "Tushunarli hujjat"],
        en: [`${p} pages`, "Responsive on phone, tablet and desktop", "SEO-ready structure", "Clear documentation"],
        files: between(r, 1, 3),
        sizeMb: between(r, 4, 90),
      };
    },
  },
  {
    id: "code",
    uz: "Kod va starter kitlar",
    en: "Code & starter kits",
    count: 4500,
    minUsd: 24,
    maxUsd: 149,
    formats: ["TypeScript", "Python", "Next.js · TypeScript", "Node.js", "Flutter · Dart"],
    nouns: [
      "SaaS Starter Kit", "Next.js Boilerplate", "Telegram Bot Starter", "REST API Template",
      "Chrome Extension Starter", "Mobile App Starter", "Auth Kit", "Admin Dashboard Code",
      "Payment Integration Kit", "CLI Tool Starter", "Chat App Source", "Landing Page Components",
    ],
    tags: ["typescript", "python", "next.js", "supabase", "stripe", "bot", "api", "auth", "boilerplate", "testing", "docker", "open source"],
    introUz: [
      "Takrorlanuvchi ishni o'tkazib yuboring: tayyor tuzilma, kirish va to'lov bilan boshlang.",
      "Toza kod, tushunarli papkalar va ishga tushirish bo'yicha qo'llanma.",
    ],
    introEn: [
      "Skip the repetitive setup: start with structure, auth and payments in place.",
      "Clean code, clear folders and a step-by-step run guide.",
    ],
    facts: (r) => {
      const t = between(r, 8, 90);
      return {
        uz: ["To'liq manba kodi", `${t} ta avtomatik test`, "README va o'rnatish qo'llanmasi", "Muhit sozlamalari namunasi (.env)"],
        en: ["Full source code", `${t} automated tests`, "README and setup guide", "Example environment file (.env)"],
        files: between(r, 1, 2),
        sizeMb: between(r, 1, 40),
      };
    },
  },
  {
    id: "ebooks",
    uz: "E-kitoblar",
    en: "E-books",
    count: 3600,
    minUsd: 7,
    maxUsd: 39,
    formats: ["PDF", "PDF · EPUB", "PDF · EPUB · MOBI"],
    nouns: [
      "Guide to Freelancing", "Handbook of Product Design", "Playbook for Startups", "Cookbook for Developers",
      "Guide to Personal Finance", "Workbook for Habits", "Handbook of Marketing", "Guide to Public Speaking",
      "Playbook for Remote Work", "Guide to Learning English", "Handbook of Productivity", "Guide to Photography",
    ],
    tags: ["pdf", "epub", "guide", "beginner", "workbook", "checklist", "case studies", "career", "business", "learning", "design", "finance"],
    introUz: [
      "Amaliy misollar va tayyor ro'yxatlar bilan, boshidan oxirigacha ketma-ket yozilgan qo'llanma.",
      "Qisqa, aniq va darhol qo'llash mumkin bo'lgan bilimlar to'plami.",
    ],
    introEn: [
      "A start-to-finish guide with practical examples and ready checklists.",
      "Short, clear knowledge you can apply right away.",
    ],
    facts: (r) => {
      const p = between(r, 40, 320), c = between(r, 6, 24);
      return {
        uz: [`${p} bet`, `${c} ta bob`, "Amaliy topshiriqlar va nazorat ro'yxatlari", "Telefon va planshetda o'qishga qulay"],
        en: [`${p} pages`, `${c} chapters`, "Exercises and checklists", "Comfortable to read on phone and tablet"],
        files: between(r, 1, 3),
        sizeMb: between(r, 2, 30),
      };
    },
  },
  {
    id: "icons",
    uz: "Ikonka to'plamlari",
    en: "Icon packs",
    count: 3000,
    minUsd: 9,
    maxUsd: 49,
    formats: ["SVG · Figma", "SVG · PNG · Figma", "SVG · PNG · Icon font"],
    nouns: [
      "Line Icon Pack", "Solid Icon Pack", "Duotone Icons", "3D Icon Set", "Hand-drawn Icons", "Social Media Icons",
      "Business Icons", "Weather Icons", "Finance Icons", "Education Icons", "Food Icons", "Travel Icons",
    ],
    tags: ["svg", "figma", "outline", "solid", "duotone", "24px", "pixel perfect", "png", "icon font", "ui", "web", "mobile"],
    introUz: [
      "Bir xil qalinlik va uslubdagi, har qanday loyihaga mos ikonkalar.",
      "Piksel aniqligida chizilgan, oson rang almashtiriladigan ikonkalar.",
    ],
    introEn: [
      "Icons with consistent stroke and style that fit any project.",
      "Pixel-aligned icons with easy color changes.",
    ],
    facts: (r) => {
      const n = between(r, 120, 2400);
      return {
        uz: [`${n} ta ikonka`, "SVG, PNG va Figma ichida", "24 va 32 pikselli tarmoq", "Rangi va qalinligini o'zgartirish mumkin"],
        en: [`${n} icons`, "SVG, PNG and Figma inside", "24 and 32 pixel grids", "Color and stroke are adjustable"],
        files: between(r, 2, 6),
        sizeMb: between(r, 3, 60),
      };
    },
  },
  {
    id: "workspace",
    uz: "Notion va jadval shablonlari",
    en: "Notion & spreadsheet templates",
    count: 3300,
    minUsd: 5,
    maxUsd: 39,
    formats: ["Notion", "Excel · Google Sheets", "Notion · Google Sheets"],
    nouns: [
      "Notion Planner", "Budget Spreadsheet", "Habit Tracker", "Project Tracker", "CRM Template", "Content Calendar",
      "Study Planner", "Invoice Template", "OKR Dashboard", "Meal Planner", "Fitness Log", "Hiring Tracker",
    ],
    tags: ["notion", "excel", "google sheets", "planner", "tracker", "dashboard", "budget", "habits", "team", "personal", "productivity", "template"],
    introUz: [
      "Nusxa oling va darhol ishlating: formulalar va ko'rinishlar tayyor.",
      "Kundalik ishni tartibga soladigan, sozlash oson shablon.",
    ],
    introEn: [
      "Duplicate it and start: formulas and views are ready.",
      "An easy-to-customize template that organizes your daily work.",
    ],
    facts: (r) => {
      const v = between(r, 4, 20);
      return {
        uz: [`${v} ta tayyor ko'rinish`, "Formulalar va avtomatlashtirish", "Qadamma-qadam sozlash qo'llanmasi", "Mobil ilovada ishlaydi"],
        en: [`${v} ready views`, "Formulas and automations", "Step-by-step setup guide", "Works in the mobile app"],
        files: between(r, 1, 3),
        sizeMb: between(r, 1, 12),
      };
    },
  },
  {
    id: "slides",
    uz: "Taqdimot qoliplari",
    en: "Slide decks",
    count: 3000,
    minUsd: 9,
    maxUsd: 59,
    formats: ["PowerPoint · Keynote", "PowerPoint · Google Slides", "Keynote · PowerPoint · Google Slides"],
    nouns: [
      "Pitch Deck", "Business Report Slides", "Marketing Plan Deck", "Education Slides", "Portfolio Presentation",
      "Startup Roadmap Deck", "Company Profile Slides", "Product Launch Deck", "Webinar Slides", "Annual Report Deck",
      "Proposal Slides", "Infographic Slides",
    ],
    tags: ["powerpoint", "keynote", "google slides", "pitch", "report", "charts", "infographic", "16:9", "business", "education", "marketing", "minimal"],
    introUz: [
      "Fikringizni aniq va chiroyli yetkazish uchun tayyor slaydlar.",
      "Diagramma, jadval va infografikalar bilan to'ldirilgan taqdimot qolipi.",
    ],
    introEn: [
      "Ready slides to present your idea clearly and beautifully.",
      "A deck filled with charts, tables and infographics.",
    ],
    facts: (r) => {
      const s = between(r, 30, 220);
      return {
        uz: [`${s} ta slayd`, "Tahrirlanadigan diagramma va infografika", "16:9 va 4:3 o'lchamlari", "Shrift va ranglar ro'yxati"],
        en: [`${s} slides`, "Editable charts and infographics", "16:9 and 4:3 sizes", "Font and color list"],
        files: between(r, 1, 3),
        sizeMb: between(r, 8, 140),
      };
    },
  },
  {
    id: "courses",
    uz: "Kurslar va qo'llanmalar",
    en: "Courses & guides",
    count: 2700,
    minUsd: 19,
    maxUsd: 199,
    formats: ["Video · PDF", "Video · PDF · Kod", "Video · Mashqlar"],
    nouns: [
      "Web Development Course", "UI Design Course", "Python Basics Course", "Data Analysis Course",
      "Freelance Business Course", "Photo Editing Course", "Video Editing Course", "Digital Marketing Course",
      "SQL Crash Course", "Mobile App Course", "English for Developers", "Excel Mastery Course",
    ],
    tags: ["video", "beginner", "projects", "certificate", "exercises", "source code", "step by step", "lifetime access", "intermediate", "bootcamp", "career", "practice"],
    introUz: [
      "Nazariyadan ko'ra amaliyotga ko'proq e'tibor beradigan, qadamma-qadam kurs.",
      "Boshlang'ich darajadan mustaqil loyiha qilishgacha olib boradigan dars to'plami.",
    ],
    introEn: [
      "A step-by-step course that favors practice over theory.",
      "Lessons that take you from beginner level to building a project on your own.",
    ],
    facts: (r) => {
      const l = between(r, 12, 90), h = between(r, 2, 24);
      return {
        uz: [`${l} ta video dars`, `Jami ${h} soat`, "Mashqlar va tayyor kod fayllari", "Umrbod kirish"],
        en: [`${l} video lessons`, `${h} hours in total`, "Exercises and ready code files", "Lifetime access"],
        files: between(r, 6, 40),
        sizeMb: between(r, 400, 6000),
      };
    },
  },
];

export const CATEGORY_MAP: Record<string, Cat> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export const BRANDS = [
  "Nova", "Atlas", "Lumen", "Orbit", "Pixel", "Kite", "Mango", "Zenith", "Quartz", "Fjord",
  "Aurora", "Bloom", "Cobalt", "Delta", "Ember", "Flux", "Glint", "Harbor", "Indigo", "Jade",
  "Kelp", "Lotus", "Maple", "Nimbus", "Onyx", "Pulse", "Quill", "Ripple", "Sable", "Tango",
  "Umber", "Vivid", "Willow", "Xenon", "Yonder", "Zephyr", "Acorn", "Birch", "Cedar", "Dune",
  "Echo", "Fable", "Grove", "Haven", "Iris", "Juniper", "Koi", "Lynx", "Mosaic", "Nectar",
  "Opal", "Prism", "Quokka", "Raven", "Sierra", "Tundra", "Ultra", "Vertex", "Wander", "Yarrow",
  "Zinnia", "Alpine", "Beacon", "Comet", "Drift", "Elm", "Falcon", "Glacier", "Hazel", "Ibis",
  "Jasper", "Kestrel", "Lagoon", "Meadow", "Nebula", "Oasis", "Pebble", "Quest", "Reef", "Summit",
  "Thistle", "Unity", "Velvet", "Wisp", "Yew", "Zest", "Amber", "Basil", "Cinder", "Dahlia",
  "Ebon", "Fern", "Garnet", "Heron", "Ivory", "Jolt", "Kiln", "Lark", "Marble", "Nutmeg",
];

export const VARIANTS = ["Pro", "Lite", "Studio", "Starter", "Essentials", "Complete", "Plus", "Mini", "Max", "2026"];

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const BASE_DATE = Date.UTC(2026, 8, 30); // 2026-09-30
const P = 7919; // butun kombinatsiyalar to'plamiga nisbatan tub son: takrorlanishsiz aralashtirish

function makeDemo(cat: Cat, catIndex: number, k: number, globalIndex: number): Product {
  const total = BRANDS.length * cat.nouns.length * VARIANTS.length;
  const n = (k * P + catIndex * 131) % total;
  const brand = BRANDS[n % BRANDS.length];
  const rest = Math.floor(n / BRANDS.length);
  const noun = cat.nouns[rest % cat.nouns.length];
  const variant = VARIANTS[Math.floor(rest / cat.nouns.length) % VARIANTS.length];
  const name = `${brand} ${noun} ${variant}`;

  const r = mulberry32(Math.imul(globalIndex, 2654435761) ^ 0x9e3779b9);
  const usd = Math.round(cat.minUsd + r() * (cat.maxUsd - cat.minUsd));
  const priceCents = Math.max(100, usd * 100 - (r() < 0.6 ? 1 : 0));
  const rating = Math.min(5, Math.round((3.8 + Math.pow(r(), 0.6) * 1.2) * 10) / 10);
  const reviews = Math.floor(Math.pow(r(), 3) * 900) + 3;
  const sales = Math.floor(Math.pow(r(), 4) * 5000) + reviews;
  const updated = new Date(BASE_DATE - Math.floor(r() * 540) * 86400000).toISOString().slice(0, 10);

  const tags: string[] = [];
  while (tags.length < 3) {
    const t = pick(r, cat.tags);
    if (!tags.includes(t)) tags.push(t);
  }
  const f = cat.facts(r);
  const introIdx = r() < 0.5 ? 0 : 1;
  const license: "personal" | "commercial" = r() < 0.5 ? "commercial" : "personal";

  return {
    id: `d${globalIndex}`,
    slug: `${slugify(name)}-${globalIndex}`,
    name,
    category: cat.id,
    priceCents,
    rating,
    reviews,
    sales,
    updatedAt: updated,
    tags,
    formats: pick(r, cat.formats),
    files: f.files,
    sizeMb: f.sizeMb,
    license,
    desc: {
      uz: `${cat.introUz[introIdx]} Ichida: ${f.uz.join("; ")}.`,
      en: `${cat.introEn[introIdx]} Inside: ${f.en.join("; ")}.`,
    },
    demo: true,
  };
}

let _demo: Product[] | null = null;

export function demoProducts(): Product[] {
  if (_demo) return _demo;
  const list: Product[] = [];
  let g = 1;
  CATEGORIES.forEach((cat, ci) => {
    for (let k = 0; k < cat.count; k++) list.push(makeDemo(cat, ci, k, g++));
  });
  _demo = list;
  return list;
}
