import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OUTPUT_MANIFEST = path.join(ROOT, "src", "assets", "image-metadata.json");
const WIDTHS = [480, 768, 1024, 1440, 1920];
const IMAGE_RE = /\.(?:jpe?g|png)$/i;

const SOURCE_DIRS = [
  { dir: path.join(PUBLIC_DIR, "assets"), publicPath: "/assets" },
  { dir: path.join(ROOT, "src", "assets"), publicPath: "/assets" },
];
const SOURCE_FILES = [path.join(PUBLIC_DIR, "logo_preview.png")];

function toPosix(value) {
  return value.split(path.sep).join("/");
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return IMAGE_RE.test(entry.name) ? [full] : [];
    }),
  );
  return files.flat(Infinity);
}

async function imageExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function publicPathFor(file, dir, publicPath) {
  if (dir === PUBLIC_DIR) return `/${toPosix(path.relative(PUBLIC_DIR, file))}`;
  return `${publicPath}/${path.basename(file)}`;
}

function outputPathFor(publicPath, width, extension) {
  const dir = path.dirname(publicPath);
  const base = path.basename(publicPath, path.extname(publicPath));
  return path.join(PUBLIC_DIR, dir === "/" ? "" : dir.slice(1), `${base}-${width}.${extension}`);
}

async function optimizeFile(file, dir, publicPath) {
  const original = publicPathFor(file, dir, publicPath);
  const metadata = await sharp(file).metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (!width || !height) return null;

  const variants = [];

  // Create base WebP/AVIF version (fallback/original) - skip if src/assets (handled by Vite)
  if (dir !== path.join(ROOT, "src", "assets")) {
    const baseName = path.basename(file, path.extname(file));
    const parentDir = path.dirname(file);
    const baseWebpPath = path.join(parentDir, baseName + ".webp");
    const baseAvifPath = path.join(parentDir, baseName + ".avif");
    if (!(await imageExists(baseWebpPath))) {
      await sharp(file).webp({ quality: 85, effort: 4 }).toFile(baseWebpPath);
    }
    if (!(await imageExists(baseAvifPath))) {
      await sharp(file).avif({ quality: 55, effort: 4 }).toFile(baseAvifPath);
    }
  }

  for (const targetWidth of WIDTHS.filter((w) => w <= width)) {
    const targetHeight = Math.round(height * (targetWidth / width));
    const pipeline = sharp(file).rotate().resize({
      width: targetWidth,
      height: targetHeight,
      fit: "inside",
      withoutEnlargement: true,
    });

    const webpPath = outputPathFor(original, targetWidth, "webp");
    const avifPath = outputPathFor(original, targetWidth, "avif");

    const webpExists = await imageExists(webpPath);
    const avifExists = await imageExists(avifPath);

    if (!webpExists) {
      await ensureDir(path.dirname(webpPath));
      await pipeline.clone().webp({ quality: 82, effort: 4 }).toFile(webpPath);
    }
    if (!avifExists) {
      await ensureDir(path.dirname(avifPath));
      await pipeline.clone().avif({ quality: 52, effort: 4 }).toFile(avifPath);
    }

    variants.push({
      width: targetWidth,
      webp: toPosix(path.relative(PUBLIC_DIR, webpPath).split(path.sep).join("/")).replace(
        /^/,
        "/",
      ),
      avif: toPosix(path.relative(PUBLIC_DIR, avifPath).split(path.sep).join("/")).replace(
        /^/,
        "/",
      ),
    });
  }

  return {
    original,
    width,
    height,
    variants,
  };
}

async function main() {
  await ensureDir(path.dirname(OUTPUT_MANIFEST));
  const files = [
    ...(
      await Promise.all(
        SOURCE_DIRS.filter((s) => existsSync(s.dir)).flatMap(async (s) => walk(s.dir)),
      )
    ).flat(Infinity),
    ...SOURCE_FILES.filter(existsSync),
  ].sort();

  const manifest = {};
  const processedOutputs = new Set();

  for (const file of files) {
    const source = SOURCE_DIRS.find((s) => file.startsWith(s.dir + path.sep));
    const dir = source?.dir ?? PUBLIC_DIR;
    const publicPath = source?.publicPath ?? "/";
    const original = publicPathFor(file, dir, publicPath);
    const outputKey = `${original}:${WIDTHS.map((w) => outputPathFor(original, w, "webp")).join(",")}`;

    if (processedOutputs.has(outputKey)) continue;
    const result = await optimizeFile(file, dir, publicPath);
    if (result) manifest[result.original] = result;
    processedOutputs.add(outputKey);
    process.stdout.write(`Optimized ${toPosix(path.relative(ROOT, file))}\n`);
  }

  await fs.writeFile(OUTPUT_MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  process.stdout.write(
    `Wrote ${Object.keys(manifest).length} image manifests to ${toPosix(path.relative(ROOT, OUTPUT_MANIFEST))}\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
