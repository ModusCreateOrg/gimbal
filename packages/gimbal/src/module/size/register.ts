import registry from '@/module/registry';
import Size from '@/module/size';
import { Report } from '@/typings/command';
import { Options } from '@/typings/module/registry';
import meta from './meta';

registry.register(
  'size',
  meta,
  ({ config, context }: Options): Promise<Report> => Size(context, config == null ? undefined : config),
);
