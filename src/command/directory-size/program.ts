import action from './index';
import Command from '@/command';
import cliOutput from '@/module/directory-size/output/cli';
import output from '@/output';

// eslint-disable-next-line no-new
export default new Command({
  action,
  cliOutput,
  command: 'directory-size',
  output,
  title: 'Directory Size Checks',
});
