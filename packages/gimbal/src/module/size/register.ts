import { register } from '@modus/gimbal-core/lib/module/registry';
import Size from '@/module/size';
import { Report } from '@/typings/command';
import { Options } from '@/typings/module/registry';
import meta from './meta';

register('size', meta, ({ commandOptions }: Options): Promise<Report> => Size(commandOptions));
