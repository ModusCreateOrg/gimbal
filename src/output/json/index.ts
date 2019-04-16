import { writeFile } from '@/utils/fs';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const JsonOutput = async (file: string, data: any): Promise<void> => writeFile(file, JSON.stringify(data, null, 2));

export default JsonOutput;
