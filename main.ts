import { chromium } from 'playwright';
import { fetchSongProperties } from './src/domain/JoysoundPageScraper';
import { convertToTable } from './src/presentation/mdconverter';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchOnePage(url: Readonly<string>): Promise<ScrapeResult[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url);
    const songProperties = await fetchSongProperties(page);
    return songProperties;
  } finally {
    await browser.close();
  }
}

(async () => {
  const baseUrl = 'https://www.joysound.com/web/search/song?match=1&keyword=%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%AB%E3%83%A9%E3%82%AA%E3%82%B1&startIndex=';
  const results: ScrapeResult[] = [];
  let startIndex = 1960;

  while (true) {
    const url = `${baseUrl}${startIndex}#songlist`;
    console.log(`Fetching: ${url}`);
    const pageResults = await fetchOnePage(url);

    if (pageResults.length === 0) {
      console.log('No more results to fetch.');
      break;
    }

    results.push(...pageResults);
    startIndex += 20;
    await sleep(3000); // 3 seconds delay
  }

  console.log(convertToTable(results));
})();