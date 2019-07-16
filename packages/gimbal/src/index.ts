import fs from 'fs';
import path from 'path';
import program from 'commander';
import readPkg from 'read-pkg';
import updateNotifier from 'update-notifier';
import Command, { preparseOptions } from '@/command';
import Config from '@/config';
import processAudits from '@/config/audits';
import processJobs from '@/config/jobs';
import Logger from '@/logger';
import { CHILD_GIMBAL_PROCESS } from '@/utils/constants';

(async (): Promise<void> => {
  const isBuilt = path.extname(__filename) === '.js';

  if (!process.env[CHILD_GIMBAL_PROCESS]) {
    const gimbal = fs.readFileSync(path.join(__dirname, 'ascii_art/gimbal.txt'), 'utf8');

    /* eslint-disable-next-line no-console */
    console.log(gimbal);
  }

  const packageJson = await readPkg({
    cwd: isBuilt ? path.join(__dirname, '../../..') : path.join(__dirname, '..'),
  });

  program
    .version(packageJson.version)
    .description('A CLI tool for monitoring web performance in modern web projects')
    // global options all command will receive
    .option('--cwd [dir]', 'The directory to work in. Defaults to where the command was executed from.', process.cwd())
    .option('--config [file]', 'The file to load as the configuration file.')
    .option('--no-comment', 'Set to disable commenting results on the VCS')
    .option('--no-check-thresholds', 'Set to disable checking thresholds.')
    .option('--output-html [file]', 'The path to write the results as HTML to.')
    .option('--output-json [file]', 'The path to write the results as JSON to.')
    .option('--output-markdown [file]', 'The path to write the results as Markdown to.')
    .option('--verbose', 'Turn on extra logging during command executions.');

  // register commands with commander
  await Command.registerCommands();

  // need to parse the options before commander kicks off so the config file
  // is loaded. This way things like plugins will be ready
  const options = preparseOptions();

  try {
    const config = await Config.load(options.cwd, options);

    // Notify of new package
    updateNotifier({ pkg: packageJson }).notify();

    // kick off commander
    program.parse(process.argv);

    if (!program.args.length) {
      if (config) {
        const { audits, jobs } = config;

        if (jobs && jobs.length) {
          await processJobs(jobs, options);
        } else if (audits && audits.length) {
          await processAudits();
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

    process.exit(0);
  } catch (e) {
    Logger.log(e);

    process.exit(1);
  }
})();
