/**
 * This class is in charge of creating the (http/https) Server
 *
 *
 * { Configuration }
 *
 *  SSL    @type {Object}
 *
 *    ENABLED      @type {Boolean}
 *    PORT         @type {Number}
 *    CREDENTIALS  @type {Object}
 *
 *  PORT     @type {Number}
 *
 *
 * Creating a new Server instance
 *
 *                          Server
 *                         [       ] --Read --> [ {Configuration} ]
 *   {Object} <- Return -- [       ]            [                 ]
 *                         [       ] <--------- [                 ]
 *
 * Starting the server
 *
 *                           Server
 *                         [  Start ] -- If SSL ON  --> Create HTPPS Server
 *   {Server} <- Return -- [        ]
 *                         [  Start ] -- If SSL OFF --> Create HTPP  Server
 *
*/

const Logger  = require('../lib/logger');
const fs      = require('fs');

module.exports = class Server{

  constructor(app, protocol, settings){
    this.app      = app;
    this.settings = settings;
    this.protocol = protocol;
    this.PORT     = process.env.PORT || this.settings.PORT;
    this[this.protocol]();
  }

  http(){
    this.sio = require('http').createServer(this.app).listen(this.PORT, this.initialize.bind(this));
  }

  https(){
    const credentials = {
      key  : fs.readFileSync(this.settings.CERTS.key , 'utf8'),
      cert : fs.readFileSync(this.settings.CERTS.cert, 'utf8')
    };
    this.sio = require('https').createServer(credentials, this.app).listen(this.PORT, this.initialize.bind(this));
  }

  initialize(){
    Logger.info({
      message     : 'Http Server',
      description : `Started at PORT=${this.PORT}`
    });
  }

}
