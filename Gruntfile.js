'use strict';

module.exports = function (grunt) {

  var gruntConfig = require('./gruntconfig');

  gruntConfig.tasks.forEach(grunt.loadNpmTasks);
  grunt.initConfig(gruntConfig);

  grunt.event.on('watch', function (action, filepath) {
    // Only lint the file that actually changed
    grunt.config(['eslint', 'scripts'], filepath);
  });

  grunt.registerTask('test', [
    'clean:build',
    'browserify',
    'postcss:build',
    'copy:build',
    'copy:test',
    'eslint:scripts',
    'eslint:tests',
    'connect:test',
    'mocha_phantomjs'
  ]);

  grunt.registerTask('build', [
    'clean:build',
    'copy:leaflet',
    'browserify',
    'postcss:build',
    'copy:build',
    'copy:test',
    'eslint:scripts',
    'eslint:tests'
  ]);

  grunt.registerTask('dist', [
    'build',
    'clean:dist',
    'copy:dist',
    'postcss:dist',
    'uglify',
    'connect:template',
    'configureRewriteRules',
    'configureProxies:dist',
    'connect:dist'
  ]);

  grunt.registerTask('default', [
    'build',
    'configureRewriteRules',
    'connect:template',
    'configureProxies:dev',
    'configureProxies:test',
    'connect:dev',
    'connect:test',
    'mocha_phantomjs',
    'watch'
  ]);

};
