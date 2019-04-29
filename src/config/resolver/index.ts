import { resolvePath } from '@/utils/fs';

const IS_FILE_RE = /^[./]/;
const IS_GIMBAL_RE = /^@\//;
const IS_USER_HOME_RE = /^~/;

const GIMBAL_ROOT = resolvePath(__dirname, '../..');

const resolver = (path: string, dir: string): string => {
  // if path starts with `~` then this is a filesystem path
  // that needs to be mapped to the user's home dir. This
  // should be handled by nodejs in a platform agnostic
  // way so we shouldn't need to do anything.
  if (path.match(IS_USER_HOME_RE)) {
    return path;
  }

  // if a path starts with `/` or `.` then this is a
  // filesystem path.
  if (path.match(IS_FILE_RE)) {
    return resolvePath(dir, path);
  }

  // if a path starts with '@/' then it should be looked up
  // as a gimbal internal plugin
  if (path.match(IS_GIMBAL_RE)) {
    return resolvePath(GIMBAL_ROOT, path.substr(2));
  }

  return path;
};

export default resolver;
