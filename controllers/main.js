const Logger = require('../lib/logger');
const User   = require('../models/user');
const nconf  = require('nconf');

let views = {};

/* Health check */
views.alive = function(req, res){
  return res.send('Ok');
};

views.index = function(req, res) {
  let isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) { return res.redirect('/app'); }
  return res.render('index', {
    env        : nconf.get('NODE:ENV') || 'dev',
    style      : nconf.get('style') || 'finserv',
    company_id : nconf.get('Cymatic:COMPANYID'),
    sdk_uuid   : nconf.get('Cymatic:SDKUUID')
  });
};

views.registration = function(req, res){
  let isAuthenticated = req.isAuthenticated();
  return res.render('registration', {
    env        : nconf.get('NODE:ENV') || 'dev',
    style      : nconf.get('style') || 'finserv',
    company_id : nconf.get('Cymatic:COMPANYID'),
    sdk_uuid   : nconf.get('Cymatic:SDKUUID')
  });
};

views.app = function(req, res){
  return res.render('app', {
    env        : nconf.get('NODE:ENV') || 'dev',
    style      : nconf.get('style') || 'finserv',
    company_id : nconf.get('Cymatic:COMPANYID'),
    sdk_uuid   : nconf.get('Cymatic:SDKUUID')
  });
};

views.resetPassword = function(req, res){
  if(!req.query.token){
    return res.render('reset-password-send-email', {
      message    : null ,
      env        : nconf.get('NODE:ENV') || 'dev',
      style      : nconf.get('style') || 'finserv',
      company_id : nconf.get('Cymatic:COMPANYID'),
      sdk_uuid   : nconf.get('Cymatic:SDKUUID')
    });
  }

  User.findOne({ reset_token : req.query.token }, (error, user ) => {
    if(error){ return res.status(400).send(error); }
    if(!user){ return res.status(404).send('Invalid token'); }

    let message = '';
    if(user.messages && user.messages.changePassword){ message = user.messages.changePassword; }

    return res.render('reset-password-send-email', {
      message,
      env        : nconf.get('NODE:ENV') || 'dev',
      style      : nconf.get('style') || 'finserv',
      company_id : nconf.get('Cymatic:COMPANYID'),
      sdk_uuid   : nconf.get('Cymatic:SDKUUID')
    });
  });
};

views.changePassword = function(req, res){
  User.findOne({ reset_token : req.query.token }, (error, user ) => {
    if(error){ return res.status(400).send(error); }
    if(!user){ return res.status(404).send('Invalid token'); }
    return res.render('reset-password-confirm', {
      env        : nconf.get('NODE:ENV') || 'dev',
      style      : nconf.get('style') || 'finserv',
      company_id : nconf.get('Cymatic:COMPANYID'),
      sdk_uuid   : nconf.get('Cymatic:SDKUUID')
    });
  });
};

module.exports = views;
