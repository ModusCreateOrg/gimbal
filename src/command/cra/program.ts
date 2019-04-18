import action from './index';
import Command from '@/command';
import cliOutput from './output/cli';
import output from '@/output';

// eslint-disable-next-line no-new
export default new Command({
  action,
  cliOutput,
  command: 'cra',
  options: [
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
  ],
  output,
  title: 'Create React App',
});
