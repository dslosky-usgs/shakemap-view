'use strict';

var config = require('./config');


var MOUNT_PATH = config.MOUNT_PATH;
var OFFSITE_HOST = config.OFFSITE_HOST;
var OFFSITE_PATHS = config.OFFSITE_PATHS;


var addMiddleware = function (connect, options, middlewares) {
  middlewares.unshift(
    require('grunt-connect-rewrite/lib/utils').rewriteRequest,
    require('grunt-connect-proxy/lib/utils').proxyRequest,
    require('gateway')(options.base[0], {
      '.php': 'php-cgi',
      'env': {
        'PHPRC': 'node_modules/hazdev-template/dist/conf/php.ini'
      }
    })
  );
  return middlewares;
};


var connect = {
  options: {
    hostname: '*'
  },

  proxies: [
    {
      context: '/theme/',
      host: 'localhost',
      port: config.templatePort,
      rewrite: {
        '^/theme': ''
      }
    },
    {
      context: OFFSITE_PATHS,
      headers: {
        'accept-encoding': 'identity',
        host: OFFSITE_HOST
      },
      host: OFFSITE_HOST,
      port: 80
    }
  ],

  rules: [
    {
      from: '^' + MOUNT_PATH + '/(.*)$',
      to: '/$1'
    }
  ],


  dev: {
    options: {
      base: [
        config.build + '/' + config.src + '/htdocs'
      ],
      livereload: config.liveReloadPort,
      middleware: addMiddleware,
      open: 'http://localhost:' + config.buildPort +
          MOUNT_PATH + '/index.html',
      port: config.buildPort
    }
  },

  dist: {
    options: {
      base: [
        config.dist + '/htdocs'
      ],
      keepalive: true,
      middleware: addMiddleware,
      open: 'http://localhost:' + config.distPort +
          MOUNT_PATH + '/index.html',
      port: config.distPort
    }
  },

  template: {
    options: {
      base: [
        'node_modules/hazdev-template/dist/htdocs'
      ],
      middleware: addMiddleware,
      port: config.templatePort
    }
  },

  test: {
    options: {
      base: [
        config.build + '/' + config.src + '/htdocs',
        config.build + '/' + config.test,
        config.etc,
        'node_modules'
      ],
      open: 'http://localhost:' + config.testPort + '/test.html',
      port: config.testPort
    }
  }
};


module.exports = connect;
