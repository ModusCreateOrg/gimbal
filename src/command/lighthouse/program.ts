import program from 'commander';
import figlet from 'figlet';
import lighthouse from './index';
import { getOptionsFromCommand } from '@/utils/command';
import { resolvePath } from '@/utils/fs';
import log from '@/utils/logger';
import { pad } from '@/utils/string';
import { LighthouseOptions } from '@/typings/command/lighthouse';
import { CommandOptions } from '@/typings/utils/command';

const LighthouseRegister = (): void => {
  program
    .command('lighthouse')
    .option(
      '-a, --artifact-dir [dir]',
      'Path to the artifact directory (defaults to `../artifacts` relative to the cwd directory)',
    )
    .action(
      async (cmd): Promise<void> => {
        const options: CommandOptions = getOptionsFromCommand(
          cmd,
          ({ artifactDir, cwd }: LighthouseOptions & CommandOptions): LighthouseOptions => ({
            artifactDir: artifactDir ? resolvePath(artifactDir) : resolvePath(cwd, '../artifacts'),
          }),
        );
        const report = await lighthouse(options);

        if (report) {
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

          messages.push('', `Artifacts written to: ${resolvePath(options.artifactDir as string)}`);

          log(messages.join('\n'));
        }
      },
    );
};

export default LighthouseRegister;
