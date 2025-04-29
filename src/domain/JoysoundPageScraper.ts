import { Page } from 'playwright';

export async function fetchSongProperties(page: Readonly<Page>, itemPerPage: Readonly<number> = 20): Promise<ScrapeResult[]> {
  const songProperties: ScrapeResult[] = [];
  for (let i = 0; i < itemPerPage; i++) {
    const titleSelector = `#jp-cmp-main > section > jp-cmp-song-search-list > div.jp-cmp-music-list-001.jp-cmp-music-list-song-001 > ul > li:nth-child(${i + 1}) > div > a > h3`;
    const referenceSelector = `#jp-cmp-main > section > jp-cmp-song-search-list > div.jp-cmp-music-list-001.jp-cmp-music-list-song-001 > ul > li:nth-child(${i + 1}) > div > a > dl > dd > span`;

    const titleElement = await page.waitForSelector(titleSelector, { timeout: 100 }).catch(() => null);
    const referenceElements = await page.$$(referenceSelector);

    const title = titleElement ? await titleElement.evaluate(el => el.childNodes[0]?.textContent?.trim() || null) : null;
    const references = await Promise.all(referenceElements.map(async el => await el.evaluate(node => node.textContent?.trim() || '')));

    if (title) {
      songProperties.push({ title, references });
    }
  }
  return songProperties;
}