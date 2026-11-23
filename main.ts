// Entry point for the news-image-20261123 submission.
//
// The finished front page lives in this repo as entry.png. This script copies
// it, byte for byte, into the output directory the grader reads
// (MAKEFUN_OUTPUT_DIR, default /output). No network, no randomness: running
// it twice produces the identical file.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1048576;
const MAX_SIDE = 1024;

// Reads width/height from a PNG (IHDR) or JPEG (first SOF marker) buffer.
// Returns null when the bytes are neither format.
function dimensions(buf: Buffer): { width: number; height: number } | null {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i += 1; continue; }
      const marker = buf[i + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      const len = buf.readUInt16BE(i + 2);
      i += 2 + len;
    }
  }
  return null;
}

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const target = join(outDir, "entry.png");

if (!existsSync(source)) {
  console.error(`missing image: ${source}`);
  process.exit(1);
}

const bytes = readFileSync(source);
if (bytes.length > MAX_BYTES) {
  console.error(`image too large: ${bytes.length} bytes (limit ${MAX_BYTES})`);
  process.exit(1);
}
const size = dimensions(bytes);
if (size === null) {
  console.error("image is neither PNG nor JPEG");
  process.exit(1);
}
if (size.width > MAX_SIDE || size.height > MAX_SIDE) {
  console.error(`image too big: ${size.width}x${size.height} (limit ${MAX_SIDE}x${MAX_SIDE})`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
console.log(`wrote ${target} (${statSync(target).size} bytes, ${size.width}x${size.height})`);
