import registry from '@/module/registry';
import UnusedSource from '@/module/unused-source';
import { Report } from '@/typings/command';
import { Options } from '@/typings/module/registry';
import meta from './meta';

registry.register(
  'unused-source',
  meta,
  async ({ chrome, context, url }: Options): Promise<Report> => {
    const page = await chrome.newPage();

    if (page) {
      const report = await UnusedSource(page, url, context);

      await page.close();

      return report;
    }

    throw new Error('Could not open page to get unused source');
  },
);
