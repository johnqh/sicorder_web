// Generates the site's PNG/ICO brand assets from the sicorder icon design
// (dark rounded tile, dotted frame, red record dot). No dependencies.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

type RGBA = [number, number, number, number];

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), Buffer.from(data)]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function encodePng(width: number, height: number, rgba: Uint8Array): Buffer {
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0;
    raw.set(rgba.subarray(y * width * 4, (y + 1) * width * 4), y * stride + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', new Uint8Array()),
  ]);
}

/** Icon shape in unit coordinates; transparent outside the rounded tile. */
function icon(u: number, v: number): RGBA {
  const radius = 0.2;
  const qx = Math.max(Math.abs(u - 0.5) - (0.5 - radius), 0);
  const qy = Math.max(Math.abs(v - 0.5) - (0.5 - radius), 0);
  if (qx * qx + qy * qy > radius * radius) return [0, 0, 0, 0];
  if (Math.hypot(u - 0.5, v - 0.5) < 0.17) return [232, 69, 60, 255];
  const ring = Math.max(Math.abs(u - 0.5), Math.abs(v - 0.5));
  if (ring > 0.3 && ring < 0.36) {
    const along = Math.abs(u - 0.5) > Math.abs(v - 0.5) ? v : u;
    if (Math.floor(along * 10) % 2 === 0) return [240, 240, 240, 255];
  }
  return [32, 33, 36, 255];
}

/** Supersampled render of `shade(x, y)` in pixel coordinates. */
function render(width: number, height: number, shade: (x: number, y: number) => RGBA): Uint8Array {
  const ss = 4;
  const out = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const acc = [0, 0, 0, 0];
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const px = shade(x + (sx + 0.5) / ss, y + (sy + 0.5) / ss);
          for (let i = 0; i < 4; i++) acc[i]! += px[i]!;
        }
      }
      for (let i = 0; i < 4; i++) out[(y * width + x) * 4 + i] = Math.round(acc[i]! / (ss * ss));
    }
  }
  return out;
}

const square = (size: number) => encodePng(size, size, render(size, size, (x, y) => icon(x / size, y / size)));

function ico(png: Buffer, size: number): Buffer {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header[6] = size; // width
  header[7] = size; // height
  header.writeUInt16LE(1, 10); // color planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // data offset
  return Buffer.concat([header, png]);
}

function ogImage(): Buffer {
  const width = 1200;
  const height = 630;
  const iconSize = 320;
  const left = (width - iconSize) / 2;
  const top = (height - iconSize) / 2;
  const background: RGBA = [15, 23, 42, 255];
  return encodePng(
    width,
    height,
    render(width, height, (x, y) => {
      const u = (x - left) / iconSize;
      const v = (y - top) / iconSize;
      if (u < 0 || u > 1 || v < 0 || v > 1) return background;
      const px = icon(u, v);
      return px[3] === 0 ? background : px;
    }),
  );
}

writeFileSync('public/logo.png', square(512));
writeFileSync('public/favicon-512.png', square(512));
writeFileSync('public/favicon-192.png', square(192));
writeFileSync('public/apple-touch-icon.png', square(180));
writeFileSync('public/favicon.ico', ico(square(32), 32));
writeFileSync('public/og-image.png', ogImage());
console.log('brand assets written to public/');
