import { v4 as uuid } from "uuid";
export const landingPageTemplate = { name: "Landing Page", slug: "landing-page", defaultBlocks: () => [
  { id: uuid(), type: "heading", data: { text: "Your Headline", level: 1 }, order: 0 },
  { id: uuid(), type: "paragraph", data: { text: "Your description here." }, order: 1 },
]};
