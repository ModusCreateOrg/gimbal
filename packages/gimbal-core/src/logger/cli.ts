// @ts-ignore
import Spinnies from 'spinnies';
import { SpinniesConfig, SpinniesFinish, SpinniesOptions } from '@/typings/logger';

export const createSpinner = (options?: SpinniesConfig): Spinnies => new Spinnies(options);

export const spinnies = createSpinner();

const parseSpinnerOptions = (options: string | SpinniesOptions | SpinniesFinish): SpinniesOptions | SpinniesFinish =>
  typeof options === 'string' ? { text: options } : options;

export const addSpinner = (name: string, options: string | SpinniesOptions): void => {
  const spinnerOptions: SpinniesOptions = parseSpinnerOptions(options);

  if (spinnerOptions.status === 'stopped') {
    spinnerOptions.text = `  ${spinnerOptions.text}`;
  }

  spinnies.add(name, spinnerOptions);
};

export const getSpinner = (name: string): SpinniesOptions => spinnies.pick(name);

export const updateSpinner = (name: string, options: string | SpinniesOptions): void => {
  const oldOptions: SpinniesOptions = getSpinner(name);
  const spinnerOptions: SpinniesOptions = parseSpinnerOptions(options);

  if (oldOptions && oldOptions.status === 'stopped' && spinnerOptions.status !== 'stopped') {
    spinnerOptions.text = spinnerOptions.text.replace(/^\s+/, '');
  }

  spinnies.update(name, spinnerOptions);
};

export const startSpinner = (name: string): void => {
  const spinnerOptions: SpinniesOptions = {
    ...getSpinner(name),
    status: 'spinning',
  };

  updateSpinner(name, spinnerOptions);
};

export const finishSpinner = (name: string, success: boolean, output: string, text: string = ''): void => {
  const oldOptions: SpinniesOptions = getSpinner(name);
  const newText = oldOptions.text.replace(/^\s+/, '');
  const spinnerOptions: SpinniesFinish = {
    ...parseSpinnerOptions(text),
    text: `${newText} - ${success ? 'Success!' : 'Failed!'} - ${output}`,
  };

  if (success) {
    spinnies.succeed(name, spinnerOptions);
  } else {
    spinnies.fail(name, spinnerOptions);
  }
};
