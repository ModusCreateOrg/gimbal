module.exports = {
  roots: [
    '<rootDir>/packages/gimbal/src',
    '<rootDir>/packages/plugin-last-value/src',
    '<rootDir>/packages/plugin-mysql/src',
    '<rootDir>/packages/plugin-sqlite/src',
    '<rootDir>/packages/shared/src',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
