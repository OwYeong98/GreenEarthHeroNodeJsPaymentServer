var env = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use((req, res, next)=> {   
    var data_stream ='';                 
   
    // Readable streams emit 'data' events once a listener is added
    req.setEncoding('utf-8')            
    .on('data', function(data) {                         
      data_stream += data;      
    })    
    .on('end', function() {           
      req.rawBody                                                 
      req.rawBody = data_stream;   
      next();
    }) 
  });

var unless = function(path, middleware) {
    return function(req, res, next) {
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};
//pass body as json
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


// See the README about ordering of middleware
// Load the routes ("controllers" -ish)
firebaseTokenCheckMiddleware = require('./middleware/firebaseTokenAuthorizationMiddleware')
firebaseTokenCheckMiddleware(app,'/api/stripe/initializePaymentIntent')


app.use('/api/stripe', require('./module/stripepayment/router'))



// FINALLY, use any error handlers
app.use(require('./module/errors/not-found'))


var config = require('./config')

// Use whichever logging system you prefer.
// Doesn't have to be bole, I just wanted something more or less realistic
var bole = require('bole')

bole.output({level: 'debug', stream: process.stdout})
var log = bole('server')

log.info('server process starting')


// Note that there's not much logic in this file.
// The server should be mostly "glue" code to set things up and
// then start listening
app.listen(process.env.PORT || 8080, function (error) {
  if (error) {
    log.error('Unable to listen for connections', error)
    process.exit(10)
  }
  log.info('express is listening on http://' +
    config.express.ip + ':' + config.express.port)
})