import GitHubCls from './GitHub';
import VCSManager from './Manager';

export const GitHub = 'GitHub';

const manager = new VCSManager({
  name: 'VCS',
});

manager.add(GitHub, GitHubCls);

export default manager;
