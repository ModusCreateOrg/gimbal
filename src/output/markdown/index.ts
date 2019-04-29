import Logger from '@/logger';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const MarkdownOutput = (file: string, data: any): void => {
  Logger.log(data);
};

export default MarkdownOutput;
