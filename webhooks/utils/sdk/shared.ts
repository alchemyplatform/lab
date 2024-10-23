export function buildQueryString(entries: (string | undefined)[][]) {
  const filteredEntries = entries.filter(([, value]) => value) as [
    string,
    string
  ][];
  const queryParams = new URLSearchParams(filteredEntries);
  const qs = queryParams.size > 1 ? `?${queryParams.toString()}` : "";
  return qs;
}
