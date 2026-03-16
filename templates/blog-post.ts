import { v4 as uuid } from "uuid";
export const blogPostTemplate = { name: "Blog Post", slug: "blog-post", defaultBlocks: () => [
  { id: uuid(), type: "heading", data: { text: "Post Title", level: 1 }, order: 0 },
  { id: uuid(), type: "paragraph", data: { text: "Start writing..." }, order: 1 },
]};
