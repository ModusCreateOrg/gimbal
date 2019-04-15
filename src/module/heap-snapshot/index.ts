import { Metrics, Page } from 'puppeteer';

const heapSnapshot = async (page: Page, url: string): Promise<Metrics> => {
  await page.goto(url);

  return page.metrics();
};

export default heapSnapshot;
