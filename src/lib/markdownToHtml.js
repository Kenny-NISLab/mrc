import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import prism from "remark-prism";
import externalLinks from "remark-external-links";
// import highlight from "remark-highlight.js";

export default async function markdownToHtml(markdown) {
  const result = await remark()
    .use(externalLinks)
    // .use(highlight)
    .use(html, { sanitize: false })
    .use(gfm)
    .use(prism)
    .process(markdown);
  return result.toString();
}
