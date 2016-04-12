'use strict';

let winston = require('winston'),
    gralConfig = require('../config');

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      prettyPrint: true,
      level: 'debug',
      label: `${gralConfig.name}`
    })
  ]
});
