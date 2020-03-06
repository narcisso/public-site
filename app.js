const Logger = require('./lib/logger');

let {environment} = require('./lib/config');

try {
  // Init server engine
  require('./engines/mongo').init();
  require('./engines/passport').init();
  require('./services/cymatic').init();
  require('./engines/server').init();

  // express routing
  require('./routes');
}catch(error){
  Logger.error({
    message     : 'Start',
    description : error.stack || error.trace || error
  });
}
