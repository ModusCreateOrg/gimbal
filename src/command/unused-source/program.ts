import action from './index';
import Command from '@/command';
import output from '@/output';

// eslint-disable-next-line no-new
export default new Command({
  action,
  command: 'unused-source',
  output,
  title: 'Unused Source Checks',
});
