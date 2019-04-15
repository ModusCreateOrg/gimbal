import bytes from 'bytes';
import figlet from 'figlet';
import { Entry, UnusedRet } from '@/typings/module/unused-source';
import log from '@/utils/logger';
import { pad } from '@/utils/string';

const bytesConfig = { unitSeparator: ' ' };

const formatMetrics = (entry: Entry | UnusedRet, padding: number = 2): string => {
  const unused = entry.total - entry.used;
  const totalUnusedPercentage = ((unused / entry.total) * 100).toFixed(2);

  return `${pad(padding)}Total Bytes: ${bytes(entry.total, bytesConfig)}
${pad(padding)}Total Used Bytes: ${bytes(entry.used, bytesConfig)}
${pad(padding)}Total Unused Bytes: ${bytes(unused, bytesConfig)} (${totalUnusedPercentage}%)`;
};

const formatFile = (entry: Entry): string => `  ${entry.url}
${formatMetrics(entry, 4)}`;

const cliOutput = (report: UnusedRet): void => {
  const messages: string[] = [
    figlet.textSync('Unused Source Report'),
    ` ${pad(100, '─')}`,
    '',
    'Page:',
    formatMetrics(report),
    '',
  ];

  if (report.css.length) {
    messages.push('CSS:');

    report.css.forEach(
      (entry: Entry): void => {
        messages.push(formatFile(entry));
      },
    );

    messages.push('');
  }

  if (report.js.length) {
    messages.push('JS:');

    report.js.forEach(
      (entry: Entry): void => {
        messages.push(formatFile(entry));
      },
    );
  }

  log(messages.join('\n'));
};

export default cliOutput;
