import CircleCICls from './CircleCI';
import GitHubActionsCls from './GitHubActions';
import CIManager from './Manager';
import TravisCICls from './TravisCI';

export const CircleCI = 'CircleCI';
export const GitHubActions = 'GitHubActions';
export const TravisCI = 'TravisCI';

const manager = new CIManager({
  name: 'CI',
});

manager.add(CircleCI, CircleCICls);
manager.add(GitHubActions, GitHubActionsCls);
manager.add(TravisCI, TravisCICls);

export default manager;
