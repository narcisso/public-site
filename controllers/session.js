const _       = require('underscore');
const Logger  = require('../lib/logger');
const User    = require('../models/user');
const cymatic = require('../services/cymatic');

let sessions = {};

sessions.login = function(req, res){
  return res.status(200).send('ok');
};

sessions.logout = function(req, res){
  let payload = {
    session_id : req.user.session_id,
    jwt        : req.body.jwt
  };

  Logger.info({
    message     : 'Logout init',
    description : payload
  });

  cymatic.api.logout(payload).then( success => {
    Logger.info({
      message     : 'Logout end',
      description : success
    });

    return out();
  }, error => {
    Logger.error({
      message     : 'Logout',
      description : error
    });

    return out();
  });

  function out(){
    req.logout(); return res.redirect('/');
  }
};

sessions.register = function(req, res){
  let jwt = req.body.jwt;
  delete req.body.jwt;

  Logger.info({
    message     : 'Registration init',
    description : {
      jwt     : jwt,
      payload : req.body
    }
  });

  async function createUser(){
    if(!jwt){ throw new Error('cymatic jwt is missing'); }

    let user    = await User.create(req.body);
    let session = { session_id : null };

    try{
      let alias = user.email;
      let registration = await cymatic.api.register({ jwt, alias });

      if(!registration){ throw new Error('Unable to register on Cymatic'); }

      Logger.info({
        message     : 'Registration Cymatic response',
        description : registration
      });

      user.c_uuid = registration.c_uuid;
      await user.save();
      let payload = { jwt, c_uuid : user.c_uuid };
      let verification = await cymatic.verify(payload, alias);

      session = await cymatic.api.login(payload);

      Logger.info({
        message     : 'Session Cymatic response',
        description : session
      });

    }catch(error){
      Logger.error({
        message     : 'Registration',
        description : error
      });
    }

    return {
      _id         : user._id,
      first_name  : user.first_name,
      last_name   : user.last_name,
      email       : user.email,
      reset_token : user.reset_token,
      messages    : user.messages,
      c_uuid      : user.c_uuid,
      session_id  : session.session_id
    };
  }

  createUser().then( user =>{
    req.login(user, function (err) {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ result : true });
    });
  }, error => {
    Logger.error({
      message     : 'Registration',
      description : error
    });
    return res.status(422).send(error);
  });
};

module.exports = sessions;
