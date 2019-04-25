import action from './index';
import Command from '@/command';
import output from '@/output';

// eslint-disable-next-line no-new
export default new Command({
  action,
  command: 'heap-snapshot',
  output,
  title: 'Heap Snapshot Checks',
});
