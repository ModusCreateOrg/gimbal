import Lighthouse from '@/module/lighthouse';
import registry from '@/module/registry';
import { Report } from '@/typings/command';
import { Options } from '@/typings/module/registry';
import meta from './meta';

registry.register(
  'lighthouse',
  meta,
  ({ args, chrome, url }: Options): Promise<Report> =>
    Lighthouse(
      url,
      {
        chromePort: chrome.port as string,
      },
      args,
    ),
);
