import Config from '@modus/gimbal-core/lib/config';
import audit from '@/command/audit';
import { preparseOptions } from '@/command';

(async (): Promise<void> => {
  // Parse config. Audits will consume config automatically
  const options = preparseOptions();
  await Config.load(options.cwd, options);
})();

// eslint-disable-next-line import/prefer-default-export
export { audit };
