import { Report } from '@/typings/command';

const JsonOutput = (report: Report): string => JSON.stringify(report, null, 2);

export default JsonOutput;
