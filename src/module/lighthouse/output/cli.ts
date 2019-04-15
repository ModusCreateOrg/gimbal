import figlet from 'figlet';
import { LighthouseOptions } from '@/typings/command/lighthouse';
import { Result } from '@/typings/module/lighthouse';
import { CommandOptions } from '@/typings/utils/command';
import { resolvePath } from '@/utils/fs';
import log from '@/utils/logger';
import { pad } from '@/utils/string';

const cliOutput = (report: Result, commandOptions: LighthouseOptions & CommandOptions): void => {
  let i = 0;
  const keys = Object.keys(report.categories).sort();
  const { length: longestTitleLength } = keys.reduce(
    (last: string, next: string): string =>
      last.length > report.categories[next].title.length ? last : report.categories[next].title,
    '',
  );
  const { length } = keys;

  const messages: string[] = [
    figlet.textSync('Lighthouse Report'),
    ` ${pad(85, '─')}`,
    '',
    `┌─${pad(longestTitleLength, '─')}─┬───────┐`,
    // 'Category'.length === 8
    `│ Category${pad(longestTitleLength - 8)} │ Score │`,
    `├─${pad(longestTitleLength, '─')}─┼───────┤`,
  ];

  while (i < length) {
    const key = keys[i];
    const category = report.categories[key];
    const { score, title } = category;
    const parsedScore = (score * 100).toFixed(0);
    const titlePad = pad(longestTitleLength - title.length);
    let scorePad: string;

    // score is on a scale of 0 to 1
    if (score < 0.1) {
      scorePad = pad(3);
    } else if (score < 1) {
      scorePad = pad(2);
    } else {
      scorePad = pad(1);
    }

    messages.push(`│ ${title}${titlePad} │ ${scorePad}${parsedScore}  │`);

    i += 1;
  }

  messages.push(`└─${pad(longestTitleLength, '─')}─┴───────┘`);

  if (commandOptions.artifactDir) {
    messages.push('', `Artifacts written to: ${resolvePath(commandOptions.artifactDir)}`);
  }

  log(messages.join('\n'));
};

export default cliOutput;
