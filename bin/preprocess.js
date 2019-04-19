/* eslint-disable @typescript-eslint/no-var-requires */
const moduleAlias = require('module-alias');
const path = require('path');

// little different than tsconfig, remove ending `/` from alias
moduleAlias.addAlias('@', path.resolve(__dirname, '../lib'));
