
export function convertToTable(scrapeResult: ScrapeResult[]): string {
  const header = '| 曲名 | コンテンツ名 |\n';
  const separator = '| --- | --- |\n';
  const rows = scrapeResult.map(item => `| ${item.title} | ${item.reference || ''} |`).join('\n');
  return header + separator + rows;
}