'use strict';


var fs = require('fs');


var config,
    basePort,
    packageJson;

basePort = 9150;
packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));


config = {
  MOUNT_PATH: '',
  OFFSITE_HOST: 'earthquake.usgs.gov',
  OFFSITE_PATHS: [
    '/archive/',
    '/earthquakes/',
    '/realtime/'
  ],

  build: '.build',
  buildPort: basePort,
  dist: 'dist',
  distPort: basePort + 1,
  etc: 'etc',
  example: 'example',
  examplePort: basePort + 2,
  lib: 'lib',
  packageJson: packageJson,
  src: 'src',
  templatePort: basePort + 3,
  test: 'test',
  testPort: basePort + 4,
  liveReloadPort: basePort + 9,

  cssPath: [
    'src/htdocs/css',
    'node_modules'
  ],

  jsPath: {
    'src/htdocs/js': '*/*.js',

    'node_modules/hazdev-webutils/src': '**/*.js'
  }

};


module.exports = config;
