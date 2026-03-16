import { v4 as uuid } from "uuid";
export const aboutPageTemplate = { name: "About Page", slug: "about-page", defaultBlocks: () => [
  { id: uuid(), type: "heading", data: { text: "About Us", level: 1 }, order: 0 },
  { id: uuid(), type: "paragraph", data: { text: "Our story..." }, order: 1 },
]};
