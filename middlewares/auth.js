module.exports.authenticated = function(req, res, next){
  if(!req.isAuthenticated()){ return res.status(401).redirect('/'); }
  return next();
};
