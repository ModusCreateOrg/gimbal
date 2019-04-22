import program from 'commander';
import fs from 'fs';
import path from 'path';
import Command from '@/command';
import Config from '@/config';
import { getOptionsFromCommand } from '@/utils/command';
import log from '@/utils/logger';
import { CHILD_GIMBAL_PROCESS } from './utils/constants';
import processJobs from './config/jobs';

(async (): Promise<void> => {
  if (!process.env[CHILD_GIMBAL_PROCESS]) {
    const gimbal = fs.readFileSync(path.join(__dirname, 'ascii_art/gimbal.txt'), 'utf8');

    log(gimbal);
  }

  program
    .version('0.0.1')
    .description('A CLI tool for monitoring web performance in modern web projects')
    // global options all command will receive
    .option('--cwd [dir]', 'The directory to work in. Defaults to where the command was executed from.')
    .option('--output-html [file]', 'The path to write the results as HTML to.')
    .option('--output-json [file]', 'The path to write the results as JSON to.')
    .option('--output-markdown [file]', 'The path to write the results as Markdown to.')
    .option('--verbose', 'Turn on extra logging during command executions.');

  // register commands with commander
  await Command.registerCommands();

  // kick off commander
  program.parse(process.argv);

  if (!program.args.length) {
    // if no args (aka commands) were passed
    // let's load the config file to see if
    // there are any jobs configured
    const options = getOptionsFromCommand();

    const config = await Config.load(options.cwd);

    if (config) {
      const { jobs } = config;

      if (jobs) {
        await processJobs(jobs, options);
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
