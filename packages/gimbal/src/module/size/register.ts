import { register } from '@/module/registry';
import Size from '@/module/size';
import { Report } from '@/typings/command';
import { Options } from '@/typings/module/registry';

register('size', ({ commandOptions }: Options): Promise<Report> => Size(commandOptions));
