var config = module.exports
var PRODUCTION = process.env.NODE_ENV === 'production'
const admin = require('firebase-admin');
var log = require('bole')('config')

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: '127.0.0.1'
}

config.mongodb = {
  port: process.env.MONGODB_PORT || 27017,
  host: process.env.MONGODB_HOST || 'localhost'
}
if (PRODUCTION) {
  // for example
  config.express.ip = '0.0.0.0'
}

key = {
    "type": process.env.firebase_type,
    "project_id": process.env.firebase_project_id,
    "private_key_id": process.env.firebase_private_key_id,
    "private_key": process.env.firebase_private_key.replace(/\\n/g, '\n'),
    "client_email": process.env.firebase_client_email,
    "client_id": process.env.firebase_client_id,
    "auth_uri": process.env.firebase_auth_uri,
    "token_uri": process.env.firebase_token_uri,
    "auth_provider_x509_cert_url": process.env.firebase_auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.firebase_client_x509_cert_url
}

admin.initializeApp({
credential: admin.credential.cert(key)
});
