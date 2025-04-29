import { chromium, Page } from 'playwright';
import { expect, test } from '@playwright/test';
import { fetchSongProperties } from '../src/domain/JoysoundPageScraper';


test.describe('fetchSongProperties', () => {
  test('should return song properties when elements exist', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Mock the page content
    await page.setContent(`
      <div id="jp-cmp-main">
        <section>
          <jp-cmp-song-search-list>
            <div class="jp-cmp-music-list-001 jp-cmp-music-list-song-001">
              <ul>
                <li>
                  <div>
                    <a>
                      <h3>Song Title 1</h3>
                      <dl>
                        <dd>
                          <span>Reference 1</span>
                        </dd>
                      </dl>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </jp-cmp-song-search-list>
        </section>
      </div>
    `);

    const result = await fetchSongProperties(page, 1);
    expect(result).toEqual([{ title: 'Song Title 1', reference: 'Reference 1' }]);

    await browser.close();
  });

  test('should return an empty array when elements do not exist', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Mock the page content with no matching elements
    await page.setContent('<div id="jp-cmp-main"></div>');

    const result = await fetchSongProperties(page, 1);
    expect(result).toEqual([]);

    await browser.close();
  });

  test('should return partial song properties when some elements exist', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Mock the page content with partial data
    await page.setContent(`
      <div id="jp-cmp-main">
        <section>
          <jp-cmp-song-search-list>
            <div class="jp-cmp-music-list-001 jp-cmp-music-list-song-001">
              <ul>
                <li>
                  <div>
                    <a>
                      <h3>Song Title 1</h3>
                      <dl>
                        <dd>
                          <span>Reference 1</span>
                        </dd>
                      </dl>
                    </a>
                  </div>
                </li>
                <li>
                  <div>
                    <a>
                      <h3>Song Title 2</h3>
                      <!-- Missing reference -->
                    </a>
                  </div>
                </li>
                <li>
                  <div>
                    <a>
                      <!-- Missing song title -->
                      <dl>
                        <dd>
                          <span>Reference 1</span>
                        </dd>
                      </dl>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </jp-cmp-song-search-list>
        </section>
      </div>
    `);

    const result = await fetchSongProperties(page, 2);
    expect(result).toEqual([
      { title: 'Song Title 1', reference: 'Reference 1' },
      { title: 'Song Title 2', reference: null },
    ]);

    await browser.close();
  });

  test('曲名に余分な要素があった場合取得しない', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Mock the page content
    await page.setContent(`
      <div id="jp-cmp-main">
        <section>
          <jp-cmp-song-search-list>
            <div class="jp-cmp-music-list-001 jp-cmp-music-list-song-001">
              <ul>
                <li>
                  <div>
                    <a>
                      <h3>Song Title 1
                      
                      
                      
                      <span>Extra Info</span>
                      </h3>
                      <dl>
                        <dd>
                          <span>Reference 1</span>
                        </dd>
                      </dl>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </jp-cmp-song-search-list>
        </section>
      </div>
    `);

    const result = await fetchSongProperties(page, 1);
    expect(result).toEqual([{ title: 'Song Title 1', reference: 'Reference 1' }]);

    await browser.close();
  });
});
