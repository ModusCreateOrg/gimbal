module.exports = {
  roots: [
    '<rootDir>/packages/gimbal/src',
    '<rootDir>/packages/gimbal-core/src',
    '<rootDir>/packages/plugin-last-value/src',
    '<rootDir>/packages/plugin-mysql/src',
    '<rootDir>/packages/plugin-sqlite/src',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
