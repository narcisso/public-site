const Logger      = require('../lib/logger');
const nconf       = require('nconf');
const MongoClient = require('../lib/mongo');

module.exports.init = function(){
  let settings = nconf.get('mongo');

  Logger.info({
    message     : 'Mongo',
    description : settings
  });

  let client = new MongoClient(settings);
  this.mongo = client.engine;
};
