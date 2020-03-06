let { passport }   = require('../engines/passport');

let local = function (req, res, next) {
  return passport.authenticate('local', function(error, user, info) {
    if (error) return res.status(401).send({error})
    if (!user) return res.status(401).send({error: 'User not found'})

    return req.login(user, function (error) {
      if (error) return res.status(401).send({error})
      return next(null, user)
    })
  })(req, res, next)
}

module.exports = {local}
