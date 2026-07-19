// One-off: convert public/logo.png into src/app/favicon.ico (multi-size)
// and src/app/apple-icon.png (180x180) for Next.js App Router conventions.
// Uses sharp (already installed in this project) and writes the ICO
// container format manually — no extra dependency needed.

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "public", "logo.png");
const OUT_ICO = path.join(__dirname, "..", "src", "app", "favicon.ico");
const OUT_APPLE = path.join(__dirname, "..", "src", "app", "apple-icon.png");

// Icon sizes to embed in the .ico file (PNG entries).
const ICO_SIZES = [16, 32, 48, 64, 256];

async function main() {
  const buf = fs.readFileSync(SRC);

  // Resize for ICO: one PNG per size, concatenated in the ICONDIR container.
  const pngs = [];
  for (const s of ICO_SIZES) {
    pngs.push(
      await sharp(buf, { density: 300 })
        .resize(s, s, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toBuffer()
    );
  }

  // BUILD ICO ===========================================================
  // ICONDIR (6 bytes) + ICONDIRENTRY[sz]*16 bytes + PNG payloads
  const headerSize = 6 + ICO_SIZES.length * 16;
  let totalSize = headerSize;
  for (const p of pngs) totalSize += p.length;

  const ico = Buffer.alloc(totalSize);
  let off = 0;
  // ICONDIR: reserved(2)=0, type(2)=1, count(2)=n
  ico.writeUInt16LE(0, 0); off += 2;
  ico.writeUInt16LE(1, off); off += 2;
  ico.writeUInt16LE(ICO_SIZES.length, off); off += 2;

  let imageOffset = headerSize;
  for (let i = 0; i < ICO_SIZES.length; i++) {
    const s = ICO_SIZES[i];
    const p = pngs[i];
    // ICONDIRENTRY: width(1), height(1), colors(1)=0, reserved(1)=0,
    //               planes(2)=1, bpp(2)=32, size(4), offset(4)
    ico.writeUInt8(s === 256 ? 0 : s, off); off += 1; // 0 means 256
    ico.writeUInt8(s === 256 ? 0 : s, off); off += 1;
    ico.writeUInt8(0, off); off += 1;
    ico.writeUInt8(0, off); off += 1;
    ico.writeUInt16LE(1, off); off += 2;
    ico.writeUInt16LE(32, off); off += 2;
    ico.writeUInt32LE(p.length, off); off += 4;
    ico.writeUInt32LE(imageOffset, off); off += 4;
    imageOffset += p.length;
  }
  // Append PNG payloads.
  for (const p of pngs) { p.copy(ico, off); off += p.length; }

  fs.writeFileSync(OUT_ICO, ico);
  console.log(`Wrote ${OUT_ICO} (${ico.length} bytes)`);

  // Apple touch icon (180x180 white-bg PNG) for Next.js apple-icon.png convention
  await sharp(buf, { density: 300 })
    .resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(OUT_APPLE);
  console.log(`Wrote ${OUT_APPLE}`);
  // Also keep a 32x32 favicon.png fallback in public/ for older browsers
  const pubFav = path.join(__dirname, "..", "public", "favicon.ico");
  fs.writeFileSync(pubFav, ico);
  console.log(`Wrote ${pubFav}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
