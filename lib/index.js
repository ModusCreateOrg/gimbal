#!/usr/bin/env node
"use strict";
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var program = require('commander');
console.log(chalk.red(figlet.textSync('perfano - ModusCreate', { horizontalLayout: 'full' })));
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
