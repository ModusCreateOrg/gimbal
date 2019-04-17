import action from './index';
import Command from '@/command';
import cliOutput from '@/module/heap-snapshot/output/cli';
import output from '@/output';

// eslint-disable-next-line no-new
export default new Command({
  action,
  cliOutput,
  command: 'heap-snapshot',
  output,
  title: 'Heap Snapshot Checks',
});
