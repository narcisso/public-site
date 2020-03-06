/**
 * This Engine will allow us to access to the same
 * instance of the server and the current express app
 *
 * @Structure
 *
 *   init   @type {Function}
 *   app    @type {Object}
 *   Server @type {Object}
 *
 *   {
 *     init   : Initialize Server Service
 *     app    : Express Application
 *     server : Http/Https Server from Server Class
 *   }
 *
*/

const Server       = require('../lib/server');
const Logger       = require('../lib/logger');
const { passport } = require('./passport');
const session      = require('express-session');
const bodyParser   = require('body-parser');
const nconf        = require('nconf');
const express      = require('express');
const _            = require('underscore');
const path         = require('path');
const MongoDBStore = require('connect-mongodb-session')(session);

let mongoSettings  = nconf.get('mongo');

module.exports = {
  servers : [],

  init : function(){
    this.app     = express();
    let settings = nconf.get('SERVER');

    Logger.info({
      message     : 'Start http server',
      description : settings
    });

    // mongo server sessions
    let store = new MongoDBStore({
      uri: process.env.MONGO || `mongodb://${mongoSettings.host}:${mongoSettings.port}/${mongoSettings.db}`,
      collection: 'Sessions'
    });

    store.on('connected', function () {
      Logger.info({
        message     : 'Mongo Session Store',
        description : 'connected'
      });
    });

    store.on('error', function(error) {
      Logger.error({
        message     : 'Mongo Session Store',
        description : error
      });
    });

    let server = new Server(this.app, 'http', settings); // Start a basic http server
    this.servers.push(server.sio); // Attach as server

    // addons
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

     // assign the swig engine to .html files
    this.app.engine('html', require('ejs').renderFile);

     // set .html as the default extension
    this.app.set('view engine', 'html');

    // Public assets
    this.app.set("views", path.join(process.cwd(), "views"));
    this.app.use(express.static(path.join(process.cwd(), "public")));

    // Log activity
    this.app.use(function(req, res, next){
      let remoteAddress = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      Logger.info({
        message     : 'Incomming request',
        description : `${remoteAddress} ${req.method} ${req.url}`
      });
      return next();
    });

    // CORS
    this.app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      return next();
    });

    // Session
    this.app.use(session({
      resave            : false,
      saveUninitialized : false,
      secret            : 'some.default-SECRET',
      cookie: {
        httpOnly          : false,
        maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
      },
      store
    }));

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    return this;
  }
};
