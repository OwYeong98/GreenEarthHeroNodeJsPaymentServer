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

// key = {
// "type": process.env.firebase_type,
// "project_id": process.env.firebase_project_id,
// "private_key_id": process.env.firebase_private_key_id,
// "private_key": process.env.firebase_private_key,
// "client_email": process.env.firebase_client_email,
// "client_id": process.env.firebase_client_id,
// "auth_uri": process.env.firebase_auth_uri,
// "token_uri": process.env.firebase_token_uri,
// "auth_provider_x509_cert_url": process.env.firebase_auth_provider_x509_cert_url,
// "client_x509_cert_url": process.env.firebase_client_x509_cert_url
// }

// log.info(keytest)
key = {
    "type": "service_account",
    "project_id": "greenearthhero-cceb4",
    "private_key_id": "c46e0ca9ed7e63be4b4c813a476a0d026177f0f3",
    "private_key": process.env.firebase_private_key,
    "client_email": "firebase-adminsdk-rcbb9@greenearthhero-cceb4.iam.gserviceaccount.com",
    "client_id": "109057861235365413275",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rcbb9%40greenearthhero-cceb4.iam.gserviceaccount.com"
}
admin.initializeApp({
credential: admin.credential.cert(key)
});
