/**
 * Pollinations.ai Test Scripti — FLUX tabanlı, ücretsiz, token gerekmez
 * Kullanım: node scripts/test-pollinations.mjs
 *
 * Testler:
 *  1. Pollinations.ai erişimi (ping)
 *  2. Moda görseli üretimi — ön, arka, sol, sağ (4 açı, seri — rate limit aşımını önler)
 *
 * Üretilen görseller: test-results/pollinations/ klasörüne kaydedilir.
 * Her çalıştırma eski görselleri temizler (--keep bayrağı ile korunur).
 */

import { mkdirSync, writeFileSync, readdirSync, rmSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "test-results", "pollinations");

// --keep bayrağı varsa önceki görseller silinmez
const keepOld = process.argv.includes("--keep");

if (!keepOld && existsSync(OUT_DIR)) {
  for (const f of readdirSync(OUT_DIR)) {
    if (f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".webp")) {
      rmSync(join(OUT_DIR, f));
    }
  }
  console.log("🗑️  Önceki görseller temizlendi (--keep ile koru)");
}
mkdirSync(OUT_DIR, { recursive: true });

// ─── Test runner ─────────────────────────────────────────────────────────────
const results = [];
let passed = 0;
let failed = 0;

async function test(name, fn) {
  const start = Date.now();
  try {
    const info = await fn();
    const duration = Date.now() - start;
    results.push({ name, status: "PASS", duration, info: info ?? null });
    console.log(`✅ PASS  [${duration}ms]  ${name}`);
    if (info) console.log("      →", info);
    passed++;
  } catch (err) {
    const duration = Date.now() - start;
    const message = err instanceof Error ? err.message : String(err);
    results.push({ name, status: "FAIL", duration, error: message });
    console.error(`❌ FAIL  [${duration}ms]  ${name}`);
    console.error("      →", message);
    failed++;
  }
}

// Pollinations URL builder
function buildUrl(prompt, width = 768, height = 1024, seed) {
  const encoded = encodeURIComponent(prompt);
  const s = seed ?? Math.floor(Math.random() * 999999);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&model=flux&nologo=true&seed=${s}&enhance=true`;
}

// ─── Test 1: Erişim testi ────────────────────────────────────────────────────
await test("Pollinations.ai erişilebilir (FLUX ping)", async () => {
  const url = buildUrl("white t-shirt product photo", 64, 64, 42);
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 100) throw new Error("Görsel çok küçük, muhtemelen hata sayfası");
  return `API erişilebilir — yanıt ${buf.length} byte`;
});

// ─── Test 2-5: 4 açıdan moda görseli üretimi (paralel) ───────────────────────
const BASE =
  "studio fashion e-commerce photo, white seamless background, full body head to toe, " +
  "female model 25yo 175cm athletic build medium skin straight dark hair, " +
  "wearing ONLY a plain white oversized cotton crew-neck t-shirt, " +
  "NO pants NO skirt NO extra clothing, bare legs or neutral leggings only, " +
  "photorealistic, sharp focus, soft even studio lighting, 4k DSLR quality";

const fashionViews = [
  {
    view: "front",
    label: "Ön",
    filename: "01-front.jpg",
    prompt: `${BASE}, model facing DIRECTLY to camera front view, full body visible from head to feet`,
  },
  {
    view: "back",
    label: "Arka",
    filename: "02-back.jpg",
    prompt: `${BASE}, model facing AWAY from camera back view, full body visible from head to feet`,
  },
  {
    view: "left",
    label: "Sol",
    filename: "03-left.jpg",
    prompt: `${BASE}, model facing LEFT sideways 90-degree profile view, full body visible from head to feet`,
  },
  {
    view: "right",
    label: "Sağ",
    filename: "04-right.jpg",
    prompt: `${BASE}, model facing RIGHT sideways 90-degree profile view, full body visible from head to feet`,
  },
];

const DELAY_MS = 3000; // İstekler arası bekleme (rate limit için)

console.log(`\n📡 4 açı seri olarak üretiliyor (aralarında ${DELAY_MS / 1000}s bekleme)...\n`);

for (const { view, label, filename, prompt } of fashionViews) {
  const name = `Moda görseli — ${label} (${view}) açısı`;
  const start = Date.now();
  console.log(`   ▶ ${label} açısı isteniyor...`);
  try {
    const url = buildUrl(prompt, 768, 1024);
    const res = await fetch(url, { signal: AbortSignal.timeout(180_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) throw new Error(`Görsel çok küçük (${buf.length} byte)`);

    const filepath = join(OUT_DIR, filename);
    writeFileSync(filepath, buf);

    const duration = Date.now() - start;
    const info = `${buf.length.toLocaleString()} byte → ${filename}`;
    results.push({ name, status: "PASS", duration, info });
    console.log(`✅ PASS  [${duration}ms]  ${name}`);
    console.log("      →", info);
    passed++;
  } catch (err) {
    const duration = Date.now() - start;
    const message = err instanceof Error ? err.message : String(err);
    results.push({ name, status: "FAIL", duration, error: message });
    console.error(`❌ FAIL  [${duration}ms]  ${name}`);
    console.error("      →", message);
    failed++;
  }

  // Son görsel değilse bekle
  if (view !== fashionViews.at(-1).view) {
    console.log(`   ⏳ ${DELAY_MS / 1000}s bekleniyor...`);
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
}

// ─── Özet JSON ───────────────────────────────────────────────────────────────
const summary = {
  timestamp: new Date().toISOString(),
  passed,
  failed,
  total: results.length,
  outputDir: OUT_DIR,
  results,
};

writeFileSync(
  join(ROOT, "test-results", "pollinations-test-results.json"),
  JSON.stringify(summary, null, 2),
  "utf-8"
);

// ─── Konsol özeti ────────────────────────────────────────────────────────────
console.log("\n" + "─".repeat(60));
console.log(`Toplam: ${passed} ✅ geçti, ${failed} ❌ başarısız`);

if (passed > 1) {
  const saved = results.filter((r) => r.status === "PASS" && r.name.includes("Moda"));
  if (saved.length) {
    console.log(`\n📁 Görseller kaydedildi: ${OUT_DIR}`);
    for (const r of saved) console.log(`   ✅ ${r.info}`);
    console.log(`\n💡 Görselleri açmak için:`);
    console.log(`   Explorer: start ${OUT_DIR}`);
  }
}
console.log("─".repeat(60));

process.exit(failed > 0 ? 1 : 0);
