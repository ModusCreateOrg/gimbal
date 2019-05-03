import action from './index';
import Command from '@/command';

// eslint-disable-next-line no-new
export default new Command({
  action,
  command: 'lighthouse',
  title: 'Lighthouse Audits',
});
