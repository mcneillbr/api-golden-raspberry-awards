/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  verbose: true,
  preset: 'ts-jest',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['node_modules',],
  // eporters: ['default', 'jest-junit'],
  // globals: { 'ts-jest': { diagnostics: false } },
  transform: {
    '^.+\\.ts?$': ['ts-jest', {
      diagnostics: false,
      useESM: true,
    }],
  }
};
