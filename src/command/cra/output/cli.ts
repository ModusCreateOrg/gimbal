import Table, { HorizontalTable } from 'cli-table3';
import HeapSnapshotCliOutput from '@/module/heap-snapshot/output/cli';
import lighthouseCliOutput from '@/module/lighthouse/output/cli';
import sizeCliOutput from '@/module/size/output/cli';
import unusedSourceCliOutput from '@/module/unused-source/output/cli';
import { CommandReturn } from '@/typings/command';
import { CliOutputOptions } from '@/typings/output/cli';
import { CommandOptions } from '@/typings/utils/command';
import log from '@/utils/logger';

const cliOutput = (report: CommandReturn, options: CommandOptions): void => {
  const table = new Table({ head: ['Category', 'Value'] }) as HorizontalTable;
  const { heapSnapshots, lighthouse, sizes, unusedSource } = report.data;
  const cliOptions: CliOutputOptions = { table };

  if (heapSnapshots) {
    table.push([{ colSpan: 2, content: '' }], [{ colSpan: 2, content: 'Heap Snapshot' }]);

    HeapSnapshotCliOutput(heapSnapshots, options, cliOptions);

    table.push([{ colSpan: 2, content: `Success: ${heapSnapshots.success}`, hAlign: 'right' }]);
  }

  if (lighthouse) {
    table.push([{ colSpan: 2, content: '' }], [{ colSpan: 2, content: 'Lighthouse' }]);

    lighthouseCliOutput(lighthouse, options, cliOptions);

    table.push([{ colSpan: 2, content: `Success: ${lighthouse.success}`, hAlign: 'right' }]);
  }

  if (sizes) {
    table.push([{ colSpan: 2, content: '' }], [{ colSpan: 2, content: 'Size' }]);

    sizeCliOutput(sizes, options, cliOptions);

    table.push([{ colSpan: 2, content: `Success: ${sizes.success}`, hAlign: 'right' }]);
  }

  if (unusedSource) {
    table.push([{ colSpan: 2, content: '' }], [{ colSpan: 2, content: 'Unused Source' }]);

    unusedSourceCliOutput(unusedSource, options, cliOptions);

    table.push([{ colSpan: 2, content: `Success: ${unusedSource.success}`, hAlign: 'right' }]);
  }

  log(table.toString());
};

export default cliOutput;
