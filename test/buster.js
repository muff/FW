var config = module.exports;

config["Server tests"] = {
  tests: ['test/**-tests.js'],
  enviroment: 'node'
};
config["Browser tests"] = {
  sources: ['src/**/*.js'],
  tests: ['test/**/*-tests.js'],
  enviroment: 'browser'
};