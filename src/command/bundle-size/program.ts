import action from './index';
import Command from '@/command';
import cliOutput from '@/module/bundle-size/output/cli';
import output from '@/output';

// eslint-disable-next-line no-new
export default new Command({
  action,
  cliOutput,
  command: 'bundle-size',
  output,
  title: 'Bundle Size Checks',
});
