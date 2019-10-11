import fs from 'fs';
import path from 'path';
import program from 'commander';
import readPkg from 'read-pkg';
import updateNotifier from 'update-notifier';
import { preparseOptions } from '@/command';
import audit from '@/command/audit/program';
import Config from '@/config';
import processAudits from '@/config/audits';
import processJobs from '@/config/jobs';
import Logger, { setFromConfigs } from '@/logger';
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
    .option('--verbose', 'Turn on extra logging during command executions.')
    // audit options
    .option(
      '--build-dir <dir>',
      'Directory storing the build artifacts relative to the --cwd (defaults to "build")',
      'build',
    )
    .option('--no-size', 'Disable checking resource sizes')
    .option('--no-calculate-unused-source', 'Disable calculating unused CSS and JavaScript')
    .option('--no-heap-snapshot', 'Disable getting a heap snapshot')
    .option('--no-lighthouse', 'Disable the lighthouse auditing')
    .option('--lighthouse-output-html <file>', 'Location to output the lighthouse HTML report to.')
    .option(
      '--route <route>',
      'Route to run tests on.',
      (value: string, previous: string | string[]): string[] => {
        // means previous is just the defaultValue
        if (!Array.isArray(previous)) {
          return [value];
        }

        previous.push(value);

        return previous;
      },
      '/',
    );

  // backwards compat so `gimbal audit` doesn't fail, we handle it below
  program.command('audit');

  // need to parse the options before commander kicks off so the config file
  // is loaded. This way things like plugins will be ready
  const options = preparseOptions();

  try {
    const config = await Config.load(options.cwd, options);

    setFromConfigs();

    // Notify of new package
    updateNotifier({ pkg: packageJson }).notify();

    // kick off commander
    program.parse(process.argv);

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
      await audit.run();
    }

    Logger.log('Finished successfully');

    process.exit(0);
  } catch (e) {
    Logger.log(e);

    Logger.log('Finished with failure');

    process.exit(1);
  }
})();
