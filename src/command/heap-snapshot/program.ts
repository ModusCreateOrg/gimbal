import program from 'commander';
import figlet from 'figlet';
import heapSnapshot from './index';
import cliOutput from '@/module/heap-snapshot/output/cli';
import output from '@/output';
import { getOptionsFromCommand } from '@/utils/command';
import log from '@/utils/logger';

const HeapSnapshotRegister = (): void => {
  program.command('heap-snapshot').action(
    async (cmd): Promise<void> => {
      try {
        const commandOptions = getOptionsFromCommand(cmd);
        const report = await heapSnapshot(commandOptions);

        log(figlet.textSync('Heap Snapshot Checks'));

        if (report) {
          cliOutput(report, commandOptions);
        }

        await output(report, commandOptions);
      } catch (error) {
        log(error);

        process.exit(1);
      }
    },
  );
};

export default HeapSnapshotRegister;
