import Table, { HorizontalTable } from 'cli-table3';
import { CommandReturn } from '@/typings/command';
import { Result } from '@/typings/module/lighthouse';
import { CliOutputOptions } from '@/typings/output/cli';
import { CommandOptions } from '@/typings/utils/command';
import log from '@/utils/logger';

const cliOutput = (report: CommandReturn, _commandOptions: CommandOptions, options?: CliOutputOptions): void => {
  const { data }: { data?: Result } = report;
  if (data) {
    const { thresholdConfig = {} } = data;
    const table =
      options && options.table
        ? options.table
        : (new Table({ head: ['Category', 'Score', 'Threshold'] }) as HorizontalTable);

    let i = 0;
    const keys = Object.keys(data.categories).sort();
    const { length } = keys;

    while (i < length) {
      const key = keys[i];
      const category = data.categories[key];
      const { score, title } = category;
      const parsedScore = (score * 100).toFixed(0);
      let threshold: string | number = '';

      if (thresholdConfig[key]) {
        threshold = thresholdConfig[key] as number;
      }

      table.push([title, { content: parsedScore, hAlign: 'right' }, { content: threshold, hAlign: 'right' }]);

      i += 1;
    }

    if (!options || !options.table) {
      // if a table wasn't passed in, output table
      // otherwise let whatever passed the table in
      // manage outputting the table
      log(table.toString());
    }
  }
};

export default cliOutput;
