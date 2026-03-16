import * as cheerio from "cheerio";
import { v4 as uuid } from "uuid";
export const htmlToBlocks = (html: string) => {
  const $ = cheerio.load(html); const blocks: any[] = []; let order = 0;
  $("body").children().each((_, el) => {
    const tag = (el as any).tagName?.toLowerCase();
    if (/^h[1-6]$/.test(tag)) blocks.push({ id: uuid(), type: "heading", data: { text: $(el).text().trim(), level: parseInt(tag[1]) }, order: order++ });
    else if (tag === "p") blocks.push({ id: uuid(), type: "paragraph", data: { text: $(el).html()?.trim() || "" }, order: order++ });
    else if (tag === "img") blocks.push({ id: uuid(), type: "image", data: { mediaId: "", alt: $(el).attr("alt")||"", src: $(el).attr("src")||"" }, order: order++ });
    else { const c = $.html(el)?.trim(); if (c) blocks.push({ id: uuid(), type: "richtext", data: { content: c }, order: order++ }); }
  });
  return blocks;
};
