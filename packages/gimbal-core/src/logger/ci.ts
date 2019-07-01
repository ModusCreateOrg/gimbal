/* eslint-disable-next-line no-console */
export const startSpinner = (name: string): void => console.log(`  [ ${name} ] starting...`);

export const finishSpinner = (name: string, success: boolean, output: string): void =>
  /* eslint-disable-next-line no-console */
  console.log(`${success ? '✓' : '✗'} [ ${name} ] - ${success ? 'Success!' : 'Failed!'} - ${output}`);
