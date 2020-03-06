const Logger   = require("./logger");
const mongoose = require('mongoose');
// fix deprecation index
mongoose.set('useCreateIndex', true);

module.exports = class MongoClient{
  constructor(settings){
    this.connectionString = process.env.MONGO || `mongodb://${settings.host}:${settings.port}/${settings.db}`;

    let options = {
      useNewUrlParser   : true,
      user              : settings.user             , // Username for authentication
      pass              : settings.pass             , // Password for authentication
      autoReconnect     : settings.autoReconnect    , // Auto reconnect
      reconnectInterval : settings.reconnectInterval, // Interval between re connection attempt
      reconnectTries    : settings.reconnectTries     // Amount of times it will try to reconnect
    };

    this.engine = mongoose.connect(this.connectionString, options, this.onConnection.bind(this));
    mongoose.connection.on('reconnectFailed', this.reconnectFailed.bind(this));

    Logger.info({
      message     : 'Mongo connection',
      description : this.connectionString
    });
  }

  onConnection(error){
    if(error){ return this.onError(error); }
    Logger.info({
      message     : 'Mongo connection',
      description : 'connected'
    });
  }

  reconnectFailed(){
    Logger.error('[Mongo Lib]: reconnected failed to mongo after 30 seconds');
    return process.exit(1);
  }

  onError(error){
    Logger.error({
      message     : 'Mongo connection',
      description : error
    });
    return process.exit(1);
  }
}
