const winston = require('winston');

module.exports = winston.createLogger({
  format     : winston.format.json(),
  transports : [ new (winston.transports.Console)({ timestamp: true }) ],
  exitOnError: false
});
