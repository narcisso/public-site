const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/user');
const Logger        = require('../lib/logger');
const cymatic       = require('../services/cymatic');
const crypto        = require('crypto');
const features      = require('nconf').get('Features');

async function authenticate(email, password, jwt){
  let user = await User.findOne({ email }).exec();
  if(!user || !user.auth(password)){ throw new Error("Incorrect email or password"); }

  let session = { session_id : null };

  Logger.info({
    message     : 'Login',
    description : {
      jwt    : jwt,
      c_uuid : user.c_uuid
    }
  });

  if(jwt && user.c_uuid){
    let payload = { jwt, c_uuid : user.c_uuid };
    let verification = await cymatic.verify(payload, email);
    if(!verification.valid){ throw new Error(verification.reason || 'Identity Verification Failed'); }

    //Feature foce Change Password
    if (features.forceChangePassword)  {
      if (user.role == 'admin' && verification.passwordBreaches){ throw new Error('Change password'); }
    }

    session = await cymatic.api.login(payload);
    Logger.info({
      message     : 'Session Cymatic response',
      description : session
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

function Strategy(req, email, password, done) {
  Logger.info({
    message     : 'Login init',
    description : { email }
  });
  authenticate(email, password, req.body.jwt).then( user => {
    return done(null, user);
  }, error => {

    Logger.error({
      message     : 'Login',
      description : error
    });

    if(error.message == 'Change password'){ return forceChangePassword(email, done); }
    return done(error.message || error);
  });
}

function forceChangePassword(email, done){
  User.findOne({ email }, (error, user ) => {
    crypto.randomBytes(20, function(error, buffer) {
      if(error){ return done('Unable to build token'); }

      let token    = buffer.toString('hex');
      let messages = user.messages || {};

      messages.changePassword = 'Looks like your password has been exposed in a data breach. To be safe, you should change your password immediately.';

      User.updateOne( {_id : user._id }, {
        forceChangePassword : true,
        reset_token         : token,
        messages            : messages
      }, function(error, code){
        if(error){ return done(error); }
        return done({ url : `reset_password?token=${token}` });
      });
    });
  });
}

module.exports = function(){
  return new LocalStrategy({
    usernameField     : 'username',
    passwordField     : 'password',
    passReqToCallback : true,
  }, Strategy);
};
