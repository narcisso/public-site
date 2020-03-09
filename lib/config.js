const nconf   = require('nconf');
const winston = require('winston');
const Logger  = require('./logger');

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
nconf.use('memory')
nconf.argv().env({ separator : '_' });

// Get current environment variable
let environment = nconf.get('NODE:ENV') || 'dev';

// Load configuration file
nconf.file({ file: `config/${environment}.json` });

Logger.info({
  message     : 'Environment Start',
  description : environment
});

module.exports = { environment };
