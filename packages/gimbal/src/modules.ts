import audit from '@/command/audit';
import { preparseOptions } from '@/command';
import Config from '@/config';

(async (): Promise<void> => {
  // Parse config. Audits will consume config automatically
  const options = preparseOptions();
  await Config.load(options.cwd, options);
})();

// eslint-disable-next-line import/prefer-default-export
export { audit };
