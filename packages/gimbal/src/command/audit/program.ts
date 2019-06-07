import action from './index';
import Command from '@/command';

// eslint-disable-next-line no-new
export default new Command({
  action,
  command: 'audit',
  options: [
    {
      defaultValue: 'build',
      description: 'Directory storing the build artifacts relative to the --cwd (defaults to "build")',
      flag: '--build-dir <dir>',
    },
    {
      description: 'Disable checking resource sizes',
      flag: '--no-size',
    },
    {
      description: 'Disable calculating unused CSS and JavaScript',
      flag: '--no-calculate-unused-source',
    },
    {
      description: 'Disable getting a heap snapshot',
      flag: '--no-heap-snapshot',
    },
    {
      description: 'Disable the lighthouse auditing',
      flag: '--no-lighthouse',
    },
    {
      description: 'Location to output the lighthouse HTML report to.',
      flag: '--lighthouse-output-html <file>',
    },
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
  title: 'Web Performance Audit',
});
