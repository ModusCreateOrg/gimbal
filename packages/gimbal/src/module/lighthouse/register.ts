import { register } from '@modus/gimbal-core/lib/module/registry';
import Lighthouse from '@/module/lighthouse';
import { Report } from '@/typings/command';
import { Options } from '@/typings/module/registry';
import meta from './meta';

register(
  'lighthouse',
  meta,
  ({ chrome, commandOptions, url }: Options): Promise<Report> =>
    Lighthouse(
      url,
      {
        chromePort: chrome.port as string,
      },
      commandOptions,
    ),
);
