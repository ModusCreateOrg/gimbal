import program from 'commander';
import fs from 'fs';
import path from 'path';
import Command, { preparseOptions } from '@/command';
import Config from '@/config';
import processJobs from '@/config/jobs';
import { CHILD_GIMBAL_PROCESS } from '@/utils/constants';
import { readFile } from '@/utils/fs';

(async (): Promise<void> => {
  if (!process.env[CHILD_GIMBAL_PROCESS]) {
    const gimbal = fs.readFileSync(path.join(__dirname, 'ascii_art/gimbal.txt'), 'utf8');

    /* eslint-disable-next-line no-console */
    console.log(gimbal);
  }

  // cannot import package.json as it is not within the rootDir (aka, src/)
  const rawPackageJson = await readFile(path.join(__dirname, '../package.json'), 'utf8');
  const packageJson = JSON.parse(rawPackageJson);

  program
    .version(packageJson.version)
    .description('A CLI tool for monitoring web performance in modern web projects')
    // global options all command will receive
    .option('--cwd [dir]', 'The directory to work in. Defaults to where the command was executed from.', process.cwd())
    .option('--no-comment', 'Set to disable commenting results on the VCS')
    .option('--output-html [file]', 'The path to write the results as HTML to.')
    .option('--output-json [file]', 'The path to write the results as JSON to.')
    .option('--output-markdown [file]', 'The path to write the results as Markdown to.')
    .option('--verbose', 'Turn on extra logging during command executions.');

  // register commands with commander
  await Command.registerCommands();

  // need to parse the options before commander kicks off so the config file
  // is loaded. This way things like plugins will be ready
  const options = preparseOptions();
  const config = await Config.load(options.cwd);

  // kick off commander
  program.parse(process.argv);

  if (!program.args.length) {
    if (config) {
      const { jobs } = config;

      if (jobs) {
        try {
          await processJobs(jobs, options);
        } catch {
          process.exit(1);
        }
      } else {
        // no jobs so there is nothing to execute
        // so let's show the help screen
        program.help();
      }
    } else {
      // no config so there is nothing to execute
      // so let's show the help screen
      program.help();
    }
  }
})();
