module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/module/'],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
