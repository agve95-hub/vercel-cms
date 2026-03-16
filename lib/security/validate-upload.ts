const MAGIC: Record<string, number[]> = { "image/jpeg":[0xff,0xd8,0xff], "image/png":[0x89,0x50,0x4e,0x47], "image/gif":[0x47,0x49,0x46], "image/webp":[0x52,0x49,0x46,0x46] };
const ALLOWED = new Set([...Object.keys(MAGIC), "image/svg+xml"]);
export const validateUpload = async (buffer: Buffer, mime: string, size: number): Promise<{valid:boolean;error?:string}> => {
  if (size > 20*1024*1024) return { valid: false, error: "File too large (max 20MB)" };
  if (!ALLOWED.has(mime)) return { valid: false, error: `Type ${mime} not allowed` };
  if (mime === "image/svg+xml") { const c = buffer.toString("utf-8"); if (/<script/i.test(c)||/on\w+\s*=/i.test(c)) return { valid: false, error: "SVG contains scripts" }; return { valid: true }; }
  const expected = MAGIC[mime];
  if (expected) { const actual = Array.from(buffer.subarray(0, expected.length)); if (!expected.every((b,i) => actual[i]===b)) return { valid: false, error: "File content mismatch" }; }
  return { valid: true };
};
