import { existsSync } from 'fs';
import path from 'path';
import { resolvePath } from '@/utils/fs';

const IS_FILE_RE = /^[./]/;
const IS_GIMBAL_RE = /^@\//;
const IS_USER_HOME_RE = /^~/;

const GIMBAL_ROOT = resolvePath(__dirname, '../..');

const resolver = (requested: string, dir: string, dirPrefix: string): string => {
  // if path starts with `~` then this is a filesystem path
  // that needs to be mapped to the user's home dir. This
  // should be handled by nodejs in a platform agnostic
  // way so we shouldn't need to do anything.
  if (requested.match(IS_USER_HOME_RE)) {
    return requested;
  }

  // if a path starts with `/` or `.` then this is a
  // filesystem path.
  if (requested.match(IS_FILE_RE)) {
    return resolvePath(dir, requested);
  }

  // if a path starts with '@/' then it should be looked up
  // as a gimbal internal plugin
  if (requested.match(IS_GIMBAL_RE)) {
    return resolvePath(GIMBAL_ROOT, requested.substr(2));
  }

  const gimbalDir = path.join(GIMBAL_ROOT, dirPrefix, requested);

  if (existsSync(gimbalDir)) {
    return resolvePath(gimbalDir);
  }

  // see if it's a node module install on the cwd
  // where gimbal is running on
  const cwdRelativeNodeModule = path.join(dir, 'node_modules', requested);

  return existsSync(cwdRelativeNodeModule) ? cwdRelativeNodeModule : requested;
};

export default resolver;
