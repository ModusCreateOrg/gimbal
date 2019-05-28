import action from './index';
import Command from '@/command';

// eslint-disable-next-line no-new
export default new Command({
  action,
  command: 'unused-source',
  options: [
    {
      defaultValue: '/',
      description: 'Route to run tests on.',
      flag: '--route <route>',
    },
  ],
  title: 'Unused Source Checks',
});
