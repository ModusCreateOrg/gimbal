import isCI from 'is-ci';
import { finishSpinner as finishSpinnerCI, startSpinner as startSpinnerCI } from './ci';
import { addSpinner as addSpinnerCLI, finishSpinner as finishSpinnerCLI, startSpinner as startSpinnerCLI } from './cli';

import { SpinniesOptions } from '@/typings/logger';

interface SpinnerTimes {
  [name: string]: [number, number];
}

const spinnerTimes: SpinnerTimes = {};

export const addSpinner = (name: string, options: string | SpinniesOptions): void =>
  isCI ? undefined : addSpinnerCLI(name, options);

export const startSpinner = (name: string): void => {
  spinnerTimes[name] = process.hrtime();

  if (isCI) {
    startSpinnerCI(name);
  } else {
    startSpinnerCLI(name);
  }
};

export const finishSpinner = (name: string, success: boolean, text = ''): void => {
  const end = process.hrtime(spinnerTimes[name]);
  const nanoseconds = end[0] * 1e9 + end[1];
  const milliseconds = nanoseconds / 1e6;
  const output = `${milliseconds.toLocaleString()} ms`;

  delete spinnerTimes[name];

  if (isCI) {
    finishSpinnerCI(name, success, output);
  } else if (success) {
    finishSpinnerCLI(name, success, output, text);
  }
};
