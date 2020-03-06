const mongoose = require('mongoose');
const crypto   = require('crypto');
const Schema   = mongoose.Schema;

let User = new Schema({
  reset_token : { type : String },
  c_uuid      : { type : String },
  first_name  : { type : String , required : true },
  last_name   : { type : String , required : true },
  password    : { type : String , required : true },
  email       : { type : String , required : true , lowercase: true, unique: true },
  role        : { type : String , default : 'user'   },
  created_at  : { type : Date   , default : Date.now },
  updated_at  : { type : Date   , default : Date.now },
  messages    : { type : Schema.Types.Mixed }
});

User.path('email').validate(function (email) {
   let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
   return emailRegex.test(email);
}, 'Must be email example: cymatic@email.com');

// validates post save
User.post('save', function (err, user, next){
  if (err.code === 11000) { return next({errors: {email: {message: 'email must be unique'}}}); }
  if (err){return next(err); }
})

User.pre('save', function (next) {
  if(this.isNew){
    let newpassword = this.encryptPassword(this.password);
    this.password = newpassword;
  }
  return next();
})

// methods
User.methods = {

  auth (pass, next) {
    return this.password === this.encryptPassword(pass);
  },

  encryptPassword (password) {
    const secret = 'shhh.a.secret.!';
    return crypto.createHmac('sha256', secret).update(password).digest('hex');
  }
}

module.exports = mongoose.model('User', User);
