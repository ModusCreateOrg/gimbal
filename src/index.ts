#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');


const init = () => {
  console.log(
    chalk.white(
      figlet.textSync("Perfano - ModusCreate", {
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
  program
    .version('0.0.1')
    .description("A CLI tool for monitoring web performance in modern web projects")
    .option('-p, --pwa', 'Check PWA')
    .option('-l, --lighthouse', 'Lighthouse Checks')
    .option('-s, --bundle-size', 'Checking bundle size')
    .parse(process.argv);
}

const runPerfTasks = async () => {
  // show script introduction
  // ask questions
  // create the file
  // show success message
};

runPerfTasks();
init();
