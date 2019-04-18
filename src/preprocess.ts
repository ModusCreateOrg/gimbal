import moduleAlias from 'module-alias';
import path from 'path';

// little different than tsconfig, remove ending `/` from alias
moduleAlias.addAlias('@', path.resolve(__dirname, '../lib'));
