function escapeMarkdownCharacters(text: string): string {
  const markdownSpecialChars = /([\\`*_{}\[\]()#+\-.!|])/g;
  return text.replace(markdownSpecialChars, '\\$1');
}

export function convertToTable(scrapeResult: ScrapeResult[]): string {
  const header = '| 曲名 | コンテンツ名 |\n';
  const separator = '| --- | --- |\n';
  const rows = scrapeResult
    .map(item => `| ${escapeMarkdownCharacters(item.title)} | ${item.references?.map((ref: string) => escapeMarkdownCharacters(ref))?.join(', ') ?? ''} |`)
    .join('\n');
  return header + separator + rows;
}