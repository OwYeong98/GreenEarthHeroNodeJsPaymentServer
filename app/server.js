var env = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//pass body as json
// support parsing of application/json type post data
app.use(bodyParser.json({
    // Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
    verify: function(req,res,buf) {
        var url = req.originalUrl;
        if (url.startsWith('/api/stripe/webhook')) {
            req.rawBody = buf.toString()
        }
    }}));

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