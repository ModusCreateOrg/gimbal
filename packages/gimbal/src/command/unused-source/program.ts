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
      process: (value: string, previous: string | string[]): string[] => {
        // means previous is just the defaultValue
        if (!Array.isArray(previous)) {
          return [value];
        }

        previous.push(value);

        return previous;
      },
    },
  ],
  title: 'Unused Source Checks',
});
