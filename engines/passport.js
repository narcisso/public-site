const passport      = require('passport');
const LocalStrategy = require('../strategies/local');

const PassportEngine = {};

PassportEngine.init = function(){
  PassportEngine.passport = passport;
  PassportEngine.passport.use(LocalStrategy());
  PassportEngine.passport.serializeUser(serialize);
  PassportEngine.passport.deserializeUser(deserialize);
};

function serialize(user, done){
  return done(null, user);
}

function deserialize(user, done){
  return done(null, user);
}

module.exports = PassportEngine;
