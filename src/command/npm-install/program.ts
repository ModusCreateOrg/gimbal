import action from './index';
import Command from '@/command';
import output from '@/output';

// eslint-disable-next-line no-new
export default new Command({
  action,
  command: 'npm-install [cmd...]',
  output,
  title: 'Npm Install',
});
