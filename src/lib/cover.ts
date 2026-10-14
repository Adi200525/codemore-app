// Har bir mahsulot uchun muqova (cover) rasmi shu yerda SVG ko'rinishida avtomatik chiziladi.
// Hech qanday tashqi rasm yoki mualliflik huquqi bilan himoyalangan material ishlatilmaydi.
import { mulberry32 } from "./demo-data";

const INK = "#0C1B3A";
const PALETTES: [string, string][] = [
  ["#2548FF", "#8FA3FF"],
  ["#FF6B2C", "#FFC29E"],
  ["#0FA37F", "#9BE8CF"],
  ["#7A3CFF", "#C9B0FF"],
  ["#E23D6B", "#FFB6C9"],
  ["#0E8FBF", "#9EDDF5"],
  ["#C99700", "#FFE27A"],
  ["#1F3A8A", "#9DB4F0"],
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function wrap(name: string, max = 24): string[] {
  const words = name.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  while (lines.length > 2) {
    const last = lines.pop() as string;
    lines[lines.length - 1] += " " + last;
  }
  return lines;
}

type R = () => number;
const ri = (r: R, a: number, b: number) => a + Math.floor(r() * (b - a + 1));

function motif(cat: string, r: R, c1: string, c2: string): string {
  let o = "";
  switch (cat) {
    case "ui-kits": {
      [0, 1, 2].forEach((i) => {
        const x = 175 + i * 160;
        const y = 80 + (i === 1 ? -14 : 8);
        o += `<rect x="${x}" y="${y}" width="140" height="290" rx="22" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
        o += `<rect x="${x + 12}" y="${y + 14}" width="116" height="30" rx="8" fill="${i === 1 ? c1 : c2}"/>`;
        let yy = y + 56;
        for (let k = 0; k < 4; k++) {
          const h = ri(r, 30, 62);
          if (yy + h > y + 270) break;
          o += `<rect x="${x + 12}" y="${yy}" width="116" height="${h}" rx="10" fill="${r() < 0.5 ? c2 : INK}" fill-opacity="${r() < 0.5 ? 0.55 : 0.1}"/>`;
          yy += h + 10;
        }
      });
      break;
    }
    case "web-templates": {
      o += `<rect x="120" y="86" width="560" height="296" rx="14" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
      o += `<rect x="120" y="86" width="560" height="38" rx="14" fill="${INK}" fill-opacity=".1"/>`;
      [0, 1, 2].forEach((i) => (o += `<circle cx="${142 + i * 18}" cy="105" r="5" fill="${INK}" fill-opacity=".4"/>`));
      o += `<rect x="140" y="140" width="520" height="120" rx="10" fill="${c1}"/>`;
      o += `<rect x="164" y="166" width="${ri(r, 180, 280)}" height="16" rx="8" fill="#fff"/>`;
      o += `<rect x="164" y="194" width="${ri(r, 120, 220)}" height="10" rx="5" fill="#fff" fill-opacity=".7"/>`;
      o += `<rect x="164" y="220" width="86" height="26" rx="13" fill="#fff"/>`;
      [0, 1, 2].forEach((i) => (o += `<rect x="${140 + i * 176}" y="276" width="168" height="84" rx="10" fill="${i === 1 ? c2 : INK}" fill-opacity="${i === 1 ? 0.6 : 0.08}"/>`));
      break;
    }
    case "code": {
      o += `<rect x="120" y="86" width="560" height="296" rx="14" fill="${INK}"/>`;
      [0, 1, 2].forEach((i) => (o += `<circle cx="${142 + i * 18}" cy="108" r="5" fill="${[c1, c2, "#fff"][i]}"/>`));
      const cols = [c1, c2, "#8FA3D6", "#FFFFFF"];
      let indent = 0;
      for (let i = 0; i < 9; i++) {
        indent = Math.max(0, Math.min(3, indent + ri(r, -1, 1)));
        const w = ri(r, 70, 300);
        o += `<rect x="${150 + indent * 28}" y="${136 + i * 27}" width="${w}" height="11" rx="5.5" fill="${cols[ri(r, 0, 3)]}" fill-opacity=".85"/>`;
        if (r() < 0.45) o += `<rect x="${160 + indent * 28 + w}" y="${136 + i * 27}" width="${ri(r, 30, 90)}" height="11" rx="5.5" fill="${cols[ri(r, 0, 3)]}" fill-opacity=".55"/>`;
      }
      break;
    }
    case "ebooks": {
      o += `<rect x="318" y="106" width="200" height="280" rx="6" fill="${INK}" fill-opacity=".18"/>`;
      o += `<rect x="304" y="90" width="200" height="280" rx="6" fill="${c1}"/>`;
      o += `<rect x="304" y="90" width="22" height="280" rx="6" fill="${INK}" fill-opacity=".28"/>`;
      o += `<rect x="346" y="128" width="${ri(r, 100, 130)}" height="16" rx="8" fill="#fff"/>`;
      o += `<rect x="346" y="156" width="${ri(r, 70, 110)}" height="16" rx="8" fill="#fff" fill-opacity=".8"/>`;
      o += `<circle cx="${ri(r, 390, 450)}" cy="270" r="${ri(r, 26, 40)}" fill="${c2}"/>`;
      o += `<rect x="346" y="334" width="80" height="8" rx="4" fill="#fff" fill-opacity=".7"/>`;
      for (let i = 0; i < 5; i++) o += `<rect x="${504 + i * 3}" y="${94 + i * 2}" width="2" height="272" fill="${INK}" fill-opacity=".25"/>`;
      break;
    }
    case "icons": {
      o += `<rect x="150" y="90" width="500" height="290" rx="18" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
      for (let row = 0; row < 3; row++)
        for (let col = 0; col < 5; col++) {
          const cx = 205 + col * 98, cy = 150 + row * 92;
          const k = ri(r, 0, 4);
          const stroke = r() < 0.5 ? c1 : INK;
          const fill = r() < 0.35 ? c2 : "none";
          if (k === 0) o += `<circle cx="${cx}" cy="${cy}" r="24" fill="${fill}" stroke="${stroke}" stroke-width="6"/>`;
          else if (k === 1) o += `<rect x="${cx - 24}" y="${cy - 24}" width="48" height="48" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="6"/>`;
          else if (k === 2) o += `<polygon points="${cx},${cy - 26} ${cx + 26},${cy + 22} ${cx - 26},${cy + 22}" fill="${fill}" stroke="${stroke}" stroke-width="6" stroke-linejoin="round"/>`;
          else if (k === 3) o += `<path d="M${cx - 22} ${cy}H${cx + 22}M${cx} ${cy - 22}V${cy + 22}" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/>`;
          else o += `<polygon points="${cx},${cy - 26} ${cx + 24},${cy} ${cx},${cy + 26} ${cx - 24},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="6" stroke-linejoin="round"/>`;
        }
      break;
    }
    case "workspace": {
      o += `<rect x="130" y="86" width="540" height="296" rx="14" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
      for (let i = 0; i < 5; i++) {
        const y = 118 + i * 52;
        const done = r() < 0.55;
        o += `<rect x="156" y="${y}" width="28" height="28" rx="8" fill="${done ? c1 : "none"}" stroke="${c1}" stroke-width="4"/>`;
        if (done) o += `<path d="M162 ${y + 14}l7 7 11-14" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
        o += `<rect x="198" y="${y + 8}" width="${ri(r, 90, 170)}" height="12" rx="6" fill="${INK}" fill-opacity="${done ? 0.2 : 0.55}"/>`;
      }
      for (let rr = 0; rr < 4; rr++)
        for (let cc = 0; cc < 3; cc++)
          o += `<rect x="${430 + cc * 76}" y="${118 + rr * 62}" width="68" height="52" rx="8" fill="${(rr + cc) % 3 === 0 ? c2 : INK}" fill-opacity="${(rr + cc) % 3 === 0 ? 0.6 : 0.08}"/>`;
      break;
    }
    case "slides": {
      o += `<rect x="190" y="120" width="520" height="292" rx="12" fill="${INK}" fill-opacity=".15"/>`;
      o += `<rect x="150" y="84" width="520" height="292" rx="12" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
      o += `<rect x="184" y="116" width="${ri(r, 150, 240)}" height="18" rx="9" fill="${INK}" fill-opacity=".8"/>`;
      o += `<rect x="184" y="146" width="${ri(r, 100, 170)}" height="10" rx="5" fill="${INK}" fill-opacity=".3"/>`;
      for (let i = 0; i < 6; i++) {
        const h = ri(r, 40, 150);
        o += `<rect x="${210 + i * 52}" y="${344 - h}" width="38" height="${h}" rx="6" fill="${i % 2 ? c2 : c1}"/>`;
      }
      o += `<circle cx="590" cy="170" r="${ri(r, 34, 48)}" fill="${c1}" fill-opacity=".9"/>`;
      break;
    }
    default: {
      // courses
      o += `<rect x="130" y="86" width="540" height="296" rx="16" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
      o += `<circle cx="400" cy="214" r="74" fill="${c1}"/>`;
      o += `<polygon points="378,176 378,252 438,214" fill="#fff"/>`;
      o += `<rect x="170" y="330" width="460" height="12" rx="6" fill="${INK}" fill-opacity=".12"/>`;
      o += `<rect x="170" y="330" width="${ri(r, 120, 380)}" height="12" rx="6" fill="${c2}"/>`;
      for (let i = 0; i < 3; i++) {
        o += `<rect x="156" y="${116 + i * 38}" width="${ri(r, 60, 90)}" height="10" rx="5" fill="${INK}" fill-opacity=".25"/>`;
        o += `<rect x="${640 - ri(r, 60, 90)}" y="${116 + i * 38}" width="${ri(r, 60, 90)}" height="10" rx="5" fill="${INK}" fill-opacity=".25"/>`;
      }
      break;
    }
  }
  return o;
}

export function coverSvg(p: { id: string; name: string; category: string }, catLabel: string): string {
  const h = hash(p.id + p.name);
  const r = mulberry32(h);
  const [c1, c2] = PALETTES[h % PALETTES.length];
  const lines = wrap(p.name);
  const grid =
    `<defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${INK}" stroke-opacity=".07" stroke-width="1"/></pattern>` +
    `<pattern id="G" width="200" height="200" patternUnits="userSpaceOnUse"><path d="M200 0H0V200" fill="none" stroke="${INK}" stroke-opacity=".12" stroke-width="1.5"/></pattern></defs>`;
  const crop = (x: number, y: number, dx: number, dy: number) =>
    `<path d="M${x} ${y + dy * 22}V${y}H${x + dx * 22}" fill="none" stroke="${INK}" stroke-width="2.5"/>`;
  const text =
    `<text x="44" y="${lines.length === 1 ? 536 : 512}" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="600" fill="${INK}" fill-opacity=".6" letter-spacing="1">${esc(catLabel)}</text>` +
    lines
      .map((l, i) => `<text x="44" y="${(lines.length === 1 ? 568 : 540) + i * 38}" font-family="Helvetica, Arial, sans-serif" font-size="32" font-weight="800" fill="${INK}">${esc(l)}</text>`)
      .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="${esc(p.name)}">` +
    `<title>${esc(p.name)}</title>${grid}` +
    `<rect width="800" height="600" fill="#F2F6FD"/><rect width="800" height="600" fill="${c2}" fill-opacity=".22"/>` +
    `<rect width="800" height="600" fill="url(#g)"/><rect width="800" height="600" fill="url(#G)"/>` +
    motif(p.category, r, c1, c2) +
    crop(20, 20, 1, 1) + crop(780, 20, -1, 1) + crop(20, 580, 1, -1) + crop(780, 580, -1, -1) +
    text +
    `</svg>`
  );
}
