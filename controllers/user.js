const User   = require('../models/user');
const crypto = require('crypto');

let UserController ={};

UserController.me = function(req, res){
  return res.status(200).send(req.user);
};

// Manual change password on session board
UserController.updatePassword = function(req, res){
  let password = req.body.password;

  User.findOne({ _id : req.user._id }, (error, user ) => {
    if(error){ return res.status(400).send(error); }
    User.updateOne( {_id : req.user._id }, {
      password : user.encryptPassword(password)
    }, function(error, code){
      if(error){ return res.status(400).send(error); }
      return res.status(200).send('updated');
    });
  });
};

UserController.resetPassword = function(req, res){
  User.findOne({ email : req.body.email }, (error, user ) => {
    if(error){ return res.status(400).send(error); }
    if(!user){ return res.status(404).send('User not found'); }

    crypto.randomBytes(20, function(error, buffer) {
      if(error){ return res.status(400).send('Unable to build token'); }
      var token = buffer.toString('hex');

      user.reset_token = token;

      user.save().then( saved =>{
        return res.status(200).json({ url : `change_password?token=${token}` });
      }, error =>{
        if(error){ return res.status(400).send('Unable to save token'); }
      });

    });

  });
};

UserController.changePassword = function(req, res){
  let password = req.body.password;
  let token    = req.query.token;

  User.findOne({ reset_token : req.query.token }, (error, user ) => {
    if(error){ return res.status(400).send(error); }
    if(!user){ return res.status(404).send('Invalid token'); }

    let messages = {};
    try{
       messages = user.messages;
      if(messages && messages.changePassword){ delete messages.changePassword; }
    }catch(error){
      // noop
    }

    User.updateOne( {_id : user._id }, {
      password    : user.encryptPassword(password),
      reset_token : null,
      messages
    }, function(error, code){
      console.log(error);
      if(error){ return res.status(400).send(error); }
      return res.status(200).send('updated');
    });
  });
};

module.exports = UserController;
