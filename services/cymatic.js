const Cymatic  = require('cymatic.api');
const Logger   = require('../lib/logger');
const nconf    = require('nconf');

const CymaticService = {};

CymaticService.init = function(){
  let settings = nconf.get('Cymatic:api');

  Logger.info({
    message     : 'Cymatic',
    description : settings
  });

  this.api = new Cymatic(settings);
};

/*
 * Requires { jwt, c_uuid }
 * */
CymaticService.verify = async function(payload, email){
  try {
    let verification = await CymaticService.api.verify(payload);

    Logger.info({
      message     : 'Verification Cymatic response',
      description : verification
    });

    let access = verification.recommendation.access.toLowerCase();

    let result = {
      valid            : access !== 'deny',
      passwordBreaches : verification.password.breaches
    };

    return result;
  } catch (error) {
    Logger.error({
      message     : 'Verification',
      description : error
    });

    throw new Error('Something went wrong');
  }
};

module.exports = CymaticService;
