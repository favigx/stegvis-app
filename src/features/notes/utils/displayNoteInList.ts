export function sanitizeAndTrimNote(html: string): string {
  if (!html) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const body = doc.body;
  const resultFragments: string[] = [];

  body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      // Om elementet är rubrik (h1–h6)
      if (/H[1-6]/.test(el.tagName)) {
        const text: string = el.textContent?.trim() || "";
        if (text) {
          resultFragments.push(`<strong>${text}</strong>`);
        }
      } else {
        // Vanligt stycke eller annat element
        const text: string = el.textContent?.trim() || "";
        if (text) {
          resultFragments.push(`<p>${text}</p>`);
        }
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text: string = node.textContent?.trim() || "";
      if (text) {
        resultFragments.push(`<p>${text}</p>`);
      }
    }
  });

  // Trunca totalt till max 10 ord
  const allText = resultFragments.join(" ");
  const words = allText.split(/\s+/);
  const truncated = words.length > 10 ? words.slice(0, 10).join(" ") + "…" : allText;

  return truncated;
}
