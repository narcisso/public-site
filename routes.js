'use strict';

const { app }      = require('./engines/server');
const Logger       = require('./lib/logger');
const main         = require('./controllers/main');
const session      = require('./controllers/session');
const user         = require('./controllers/user');
const providers    = require('./middlewares/localPassport');
let authMiddleware = require('./middlewares/auth');


// Views
app.get('/alive'           , main.alive);
app.get('/'                , main.index);
app.get('/registration'    , main.registration);
app.get('/app'             , authMiddleware.authenticated , main.app);
app.get('/reset_password'  , main.resetPassword);
app.get('/change_password' , main.changePassword);

// Session
app.post('/login'   , providers.local, session.login);
app.post('/logout'  , session.logout);
app.post('/register', session.register);

// User
app.post('/me'              , authMiddleware.authenticated, user.me);
app.post('/password'        , authMiddleware.authenticated, user.updatePassword);
app.post('/reset_password'  , user.resetPassword);
app.post('/change_password' , user.changePassword);

Logger.info('[Routes] Loaded');
