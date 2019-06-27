import { register } from '@modus/gimbal-core/lib/module/registry';
import HeapSnapshot from '@/module/heap-snapshot';
import { Report } from '@/typings/command';
import { Options } from '@/typings/module/registry';
import meta from './meta';

register(
  'heap-snapshot',
  meta,
  async ({ chrome, commandOptions, url }: Options): Promise<Report> => {
    const page = await chrome.newPage();

    if (page) {
      const report = await HeapSnapshot(page, url, commandOptions);

      await page.close();

      return report;
    }

    throw new Error('Could not open page to get heap snapshot');
  },
);
