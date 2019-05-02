/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const envOrDefault = (variableName: string, defaultValue?: any): any => {
  const envValue = process.env[variableName];

  // parse booleans by default
  if (envValue === 'true') {
    return true;
  }

  if (envValue === 'false') {
    return false;
  }

  if (envValue === undefined) {
    return defaultValue;
  }

  return envValue;
};

export default envOrDefault;
