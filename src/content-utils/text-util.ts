export function splitTextByLine(text: string) {
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
