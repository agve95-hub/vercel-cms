import DOMPurify from "isomorphic-dompurify";
export const sanitizeHtml = (dirty: string): string => DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ["p","h1","h2","h3","h4","h5","h6","a","strong","em","b","i","u","ul","ol","li","blockquote","br","img","span","hr","pre","code"], ALLOWED_ATTR: ["href","target","rel","src","alt","title","class","width","height","loading"], FORBID_TAGS: ["script","iframe","object","embed","form"] });
export const sanitizePlainText = (t: string): string => t.replace(/[<>&"']/g, c => ({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"}[c] || c));
