import action from './index';
import Command from '@/command';
import cliOutput from '@/module/unused-source/output/cli';
import output from '@/output';

// eslint-disable-next-line no-new
export default new Command({
  action,
  cliOutput,
  command: 'unused-source',
  output,
  title: 'Unused Source Checks',
});
