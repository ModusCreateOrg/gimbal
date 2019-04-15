import figlet from 'figlet';
import { Metrics } from 'puppeteer';
import log from '@/utils/logger';
import { pad } from '@/utils/string';

const keysToCareAbout = [
  'Documents',
  'Frames',
  'Nodes',
  'LayoutCount',
  'RecalcStyleCount',
  'JSHeapUsedSize',
  'JSHeapTotalSize',
];

const { length: longestKeyLength } = keysToCareAbout.reduce(
  (last: string, next: string): string => (last.length > next.length ? last : next),
  '',
);

interface ParsedMetric {
  key: string;
  value: string;
}

const cliOutput = (report: Metrics): void => {
  let longestValueLength = 0;

  const map = keysToCareAbout.map(
    (key: string): ParsedMetric => {
      // @ts-ignore
      const value = String(report[key]);

      if (value.length > longestValueLength) {
        longestValueLength = value.length;
      }

      return {
        key,
        value,
      };
    },
  );

  const messages: string[] = [
    figlet.textSync('Heap Snapshot Report'),
    ` ${pad(103, '─')}`,
    '',
    `┌─${pad(longestKeyLength, '─')}─┬─${pad(longestValueLength, '─')}─┐`,
    // 'Category'.length === 8, 'Value'.length === 5
    `│ Category${pad(longestKeyLength - 8)} │ Value${pad(longestValueLength - 5)} │`,
    `├─${pad(longestKeyLength, '─')}─┼─${pad(longestValueLength, '─')}─┤`,
  ];

  map.forEach(
    ({ key, value }: ParsedMetric): void => {
      const titlePad = pad(longestKeyLength - key.length);
      const valuePad = pad(longestValueLength - value.length);

      messages.push(`│ ${key}${titlePad} │ ${value}${valuePad} │`);
    },
  );

  messages.push(`└─${pad(longestKeyLength, '─')}─┴─${pad(longestValueLength, '─')}─┘`);

  log(messages.join('\n'));
};

export default cliOutput;
