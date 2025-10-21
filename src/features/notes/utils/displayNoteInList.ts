export function sanitizeAndTrimNote(html: string): string {
  if (!html) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const body = doc.body;
  const fragments: string[] = [];

  body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      // Rubrik H1–H6
      if (/H[1-6]/.test(el.tagName)) {
        const text: string = el.textContent?.trim() || "";
        if (text) fragments.push(`<strong>${text}</strong>`);
      } else {
        const text: string = el.textContent?.trim() || "";
        if (text) fragments.push(text);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text: string = node.textContent?.trim() || "";
      if (text) fragments.push(text);
    }
  });

  // All text på samma rad, trunca till max 10 ord
  const allText = fragments.join(" "); // inga <p> eller radbrytningar
  const words = allText.split(/\s+/);
  const truncated = words.length > 10 ? words.slice(0, 6).join(" ") + "…" : allText;

  return truncated;
}
