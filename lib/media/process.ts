import sharp from "sharp";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { v4 as uuid } from "uuid";

const SIZES = { thumb: 400, medium: 800, large: 1200 } as const;

export const processImage = async (buffer: Buffer, originalFilename: string) => {
  const dir = path.join("uploads", new Date().getFullYear().toString(), (new Date().getMonth()+1).toString().padStart(2,"0"));
  await mkdir(dir, { recursive: true });
  const ext = path.extname(originalFilename).toLowerCase();
  const base = uuid();
  const metadata = await sharp(buffer).metadata();
  const originalPath = path.join(dir, `${base}${ext}`);
  await writeFile(originalPath, buffer);
  const variants: Record<string, string> = {};
  for (const [name, width] of Object.entries(SIZES)) {
    const jpgPath = path.join(dir, `${base}-${name}${ext}`);
    await sharp(buffer).resize(width, undefined, { withoutEnlargement: true }).jpeg({ quality: 80 }).toFile(jpgPath);
    variants[name] = jpgPath;
    const webpPath = path.join(dir, `${base}-${name}.webp`);
    await sharp(buffer).resize(width, undefined, { withoutEnlargement: true }).webp({ quality: 80 }).toFile(webpPath);
    variants[`${name}Webp`] = webpPath;
  }
  return { original: originalPath, variants, width: metadata.width || 0, height: metadata.height || 0 };
};
