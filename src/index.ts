#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

console.log(
  chalk.red(
    figlet.textSync('perfano - ModusCreate', { horizontalLayout: 'full' })
  )
);


program
	.version('0.0.1')
  .description("A CLI tool for monitoring web performance in modern web projects")
  .option('-p, --pwa', 'Check PWA')
  .option('-l, --lighthouse', 'Lighthouse Checks')
  .option('-s, --bundle-size', 'Checking bundle size')
  .parse(process.argv);


if (!process.argv.slice(2).length) {
	program.outputHelp();
}
