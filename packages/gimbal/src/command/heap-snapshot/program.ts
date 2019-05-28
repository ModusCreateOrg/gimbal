import action from './index';
import Command from '@/command';

// eslint-disable-next-line no-new
export default new Command({
  action,
  command: 'heap-snapshot',
  options: [
    {
      defaultValue: '/',
      description: 'Route to run tests on.',
      flag: '--route <route>',
    },
  ],
  title: 'Heap Snapshot Checks',
});
