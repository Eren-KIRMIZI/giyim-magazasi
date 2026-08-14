export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u00C0-\u017F-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}
