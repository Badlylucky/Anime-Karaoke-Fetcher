import { chromium } from 'playwright';
import { fetchSongProperties } from './src/JoysoundPageScraper';

export async function fetchOnePage(url: Readonly<string>): Promise<{ title: string; reference: string|null }[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const songProperties = await fetchSongProperties(page);

  return songProperties;
}

(async () => {
  const url = 'https://www.joysound.com/web/search/song?match=1&keyword=%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%AB%E3%83%A9%E3%82%AA%E3%82%B1&startIndex=0#songlist';
  const title = await fetchOnePage(url);
  console.log('First song title:', title);
})();