import { test, expect } from '@playwright/test';
import { convertToTable } from '../src/presentation/mdconverter';

test.describe('convertToTable', () => {
  test('should convert scrape results to a markdown table', async () => {
    const scrapeResult = [
      { title: 'Song A', reference: 'Content A' },
      { title: 'Song B', reference: 'Content B' },
      { title: 'Song C', reference: null },
    ];

    const expectedTable = `| 曲名 | コンテンツ名 |
| --- | --- |
| Song A | Content A |
| Song B | Content B |
| Song C |  |`;

    const result = convertToTable(scrapeResult);

    expect(result).toBe(expectedTable);
  });
});