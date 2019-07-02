import { pad } from '@modus/gimbal-core/lib/utils/string';
import colors from 'colors/safe';
import Config from '@/config';

const colorsArray = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'];
let last: number;

const $defaultLevels = ['verbose', 'log', 'error'];
const [, $defaultLevel] = $defaultLevels;

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
interface DeepArray<T> extends Array<T | DeepArray<T>> {}
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type LoggerArgs = DeepArray<any>;

type LoggerFunction = (...val: LoggerArgs) => void;
type LoggerGroupFunction = (...groups: LoggerArgs) => void;
interface LoggerGroup {
  [name: string]: LoggerGroupFunction;
}

interface Logger {
  error: LoggerFunction;
  group: LoggerGroup;
  log: LoggerFunction;
  verbose: LoggerFunction;
  [name: string]: LoggerFunction | LoggerGroup;
}

const $levels: string[] = Config.get('configs.logger.levels', $defaultLevels); // possible levels to log out
let $allowedLevel: string = Config.get('configs.logger.level', $defaultLevel); // one of the values from $levels or 'silent' for no logging
const $indentLevel = Config.get('configs.logger.indent', 2); // the number of spaces to indent by when grouping

/* eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars */
const emptyLoggerFn: LoggerFunction = (..._val: LoggerArgs): void => {};

// checks to see whether the requested level is allowed to be logged
const isLevelAllowed = (level: string): boolean => {
  const allowed = $levels.indexOf($allowedLevel);
  const requested = $levels.indexOf(level);

  return requested > -1 && requested >= allowed;
};

/* eslint-disable-next-line no-console */
const log = (...logs: LoggerArgs): void => console.log(...logs);

// logs out the passed string with indentation.  The indentation is calculated
// by multiplying the passed indent value and $indentLevel
const logIndented = (val: LoggerArgs, indent: number = 0): void => {
  let item: string;

  if (val) {
    const indention = pad($indentLevel * indent);

    if (typeof val === 'string') {
      item = `${indention}${val}`;
    } else if (val instanceof Error && val.stack) {
      item = val.stack
        .split(/\n/)
        .map((line: string): string => `${indention}${line}`)
        .join('\n');
    } else if (typeof val === 'object') {
      item = JSON.stringify(val)
        .split(/\n/)
        .map((line: string): string => `${indention}${line}`)
        .join('\n');
    } else {
      item = `${pad($indentLevel * indent)}${val}`;
    }
  } else {
    item = '';
  }

  log(item);
};

// logs out a group of strings.  An array of strings or sub string arrays should
// be passed in.
const logGroup = (group: LoggerArgs, indent: number = 0): void => {
  group.forEach((val: LoggerArgs): void => {
    if (Array.isArray(val)) {
      logGroup(val, indent + 1);
    } else {
      logIndented(val, indent);
    }
  });
};

// handles the grouped logging of all arguments passed
const group = (...groups: LoggerArgs): void => {
  [...groups].forEach((grp): void => {
    logGroup(grp as LoggerArgs);
  });
};

// Sets the allowed logging level
export const setLevel = (level: string): void => {
  const index = $levels.findIndex(($level: string): boolean => $level.toLowerCase() === level.toLowerCase());

  if (index > -1) {
    $allowedLevel = $levels[index];
  } else {
    throw new Error(`Level "${level}" not found in ${JSON.stringify($levels)}`);
  }
};

const createLoggerFunction = (level: string, time: boolean = false, ...prefixes: string[]): LoggerFunction => (
  ...val: LoggerArgs
): void => {
  if (isLevelAllowed(level)) {
    const parsedPrefixes = prefixes.slice();

    if (time) {
      parsedPrefixes.push(`[${new Date().toISOString()}]`);
    }

    log(...parsedPrefixes, ...val);
  }
};

const createLoggerGroupFunction = (level: string, fn?: LoggerFunction): LoggerGroupFunction => (
  ...groups: LoggerArgs
): void => {
  if (isLevelAllowed(level)) {
    if (fn) {
      fn();
    }

    group(...groups);
  }
};

const levelMaker = (level: string, logger: Logger): void => {
  /* eslint-disable-next-line no-param-reassign */
  logger[level] = createLoggerFunction(level);
  /* eslint-disable-next-line no-param-reassign */
  logger.group[level] = createLoggerGroupFunction(level);
};

// Sets the allowed logging levels
// The levels passed are added as callable methods on Console
// i.e. pass ['info', 'error'] and you can then log out with
// Console.info('string') or Console.error('string) with each
// respecting the $allowedLevel
//
// Additionally, a 'group' property is set on the returned object.  The
// 'group' property also has a method for each logging level.  These functions
// expect an array of strings / sub-arrays to be passed in order to indent by
// nested array level
//
// If $allowedLevel is undefined the first level passed is set
// as the $allowedLevel
export const createLogger = (maker = levelMaker): Logger => {
  const logger: Logger = {
    error: emptyLoggerFn,
    group: {},
    log: emptyLoggerFn,
    verbose: emptyLoggerFn,
  };

  $levels.forEach((level): void => maker(level, logger));

  return logger;
};

const getNextColor = (): string => {
  if (last == null) {
    last = 0;
  } else {
    last += 1;
  }

  if (last >= colorsArray.length) {
    // start back from beginning
    last = 0;
  }

  return colorsArray[last];
};

// Allows you to pass a name string that returns a logging function that
// logs the string passed prefixed with the name.  The level logged is the
// current $allowedLevel
//
// The returned function has a method for logging each of the levels currently
// allowed.
//
// Additionally, a 'group' property is set on the returned function.  The
// 'group' property also has a method for each logging level.  These functions
// expect an array of strings / sub-arrays to be passed in order to indent by
// nested array level
export const namedLogger = (name: string, timeStamp: boolean = true): Logger => {
  const nextColor = getNextColor();

  return createLogger((level: string, logger: Logger): void => {
    // @ts-ignore
    const nameColor = colors[nextColor](name);
    const fn = createLoggerFunction(level, timeStamp, nameColor);

    /* eslint-disable-next-line no-param-reassign */
    logger[level] = fn;
    /* eslint-disable-next-line no-param-reassign */
    logger.group[level] = createLoggerGroupFunction(level, fn);
  });
};

// The main logger object
const Logger: Logger = createLogger();

export default Logger;
