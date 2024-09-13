module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 100,
      lines: 100,
      statements: 100
    },
  },
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/styleMock.js'
  },
};