import HeapSnapshot from '@/module/heap-snapshot';
import registry from '@/module/registry';
import { Report } from '@/typings/command';
import { Options } from '@/typings/module/registry';
import meta from './meta';

registry.register(
  'heap-snapshot',
  meta,
  async ({ chrome, config, context, url }: Options): Promise<Report> => {
    const page = await chrome.newPage();

    if (page) {
      const report = await HeapSnapshot(page, url, context, config == null ? undefined : config);

      await page.close();

      return report;
    }

    throw new Error('Could not open page to get heap snapshot');
  },
);
