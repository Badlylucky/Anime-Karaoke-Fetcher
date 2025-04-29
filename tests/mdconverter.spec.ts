import { test, expect } from '@playwright/test';
import { convertToTable } from '../src/presentation/mdconverter';

test.describe('convertToTable', () => {
  test('should convert scrape results to a markdown table', async () => {
    const scrapeResult: ScrapeResult[] = [
      { title: 'Song A', references: ['Content A'] },
      { title: 'Song B', references: ['Content B', 'Content C'] },
      { title: 'Song C', references: [] },
    ];

    const expectedTable = `| 曲名 | コンテンツ名 |
| --- | --- |
| Song A | Content A |
| Song B | Content B, Content C |
| Song C |  |`;

    const result = convertToTable(scrapeResult);

    expect(result).toBe(expectedTable);
  });
});