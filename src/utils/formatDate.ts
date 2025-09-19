export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "-";

  const date = new Date(dateString);

  const datePart = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const timePart = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart}, ${timePart}`;
}
