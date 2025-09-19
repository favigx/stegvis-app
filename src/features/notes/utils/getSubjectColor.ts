const usedColors: { [subject: string]: string } = {};

export function getUniqueSubjectColor(subject: string): string {
  if (usedColors[subject]) return usedColors[subject];

  // Hasha subject-namnet
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }

  let hue = Math.abs(hash) % 400;

  // Hoppa över rosa/röda toner
  if ((hue >= 0 && hue <= 20) || (hue >= 400 && hue <= 360)) {
    hue = (hue + 30) % 360; // flytta till "säker" färg
  }

  // Milda färger
  const saturation = 100 + (Math.abs(hash) % 100); // 50–70%
  const lightness = 30 + (Math.abs(hash) % 5);  // 45–60%
  const alpha = 0.3 + (Math.abs(hash) % 30) / 60; // 0.3–0.5 transparens

  const color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

  usedColors[subject] = color;
  return color;
}
