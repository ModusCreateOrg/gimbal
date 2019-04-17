import action from './index';
import Command from '@/command';
import cliOutput from '@/module/lighthouse/output/cli';
import output from '@/output';

// eslint-disable-next-line no-new
export default new Command({
  action,
  cliOutput,
  command: 'lighthouse',
  output,
  title: 'Lighthouse Audits',
});
