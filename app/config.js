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
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCo7K8GnlXoI3ZF\nsXIf0axgat74bR9c28U2a9P8GYXY2QIozzGWssztsOghK8S9YXIQqcQdZfpEaC9O\ndZB/L3UnyYuQpa1E/0St2OEtyPt7DZA0y1GC5EiCHCgvmsW6T8hvhwiZ9qYbSyOk\ncn0mzgxsdIUo02NhzkwokONdssrVjDJZ4W4xe3yFcfyzLAaZnlvEjq6RNB9iOAgm\nMjQD7pZi0woos71YNucYzeZoW3Tm1CfIq6u9IThM9DmMdZNSmFEIDeZ8vIOFOiG2\ngvoT5JchDOOt6FFR8G9AENa08fdoBqzLj0CCnXzb+bL52oW/kRAu25b23qdXZ1es\nNu9B/c8rAgMBAAECggEAEoNiCUEoHBlq2GeCoO8bS7PavPJEqioh2n2FzY7Ehwf9\nfxh6EFCHOhOV1TDVToYT+LSKXEh1XbLnYFttGytJ1TL2+0LVEwdA8SagQyLQQOOz\nJr4TsFsxgSTx2InHWsxspKBxdmI8QSiCfv7XLX4OiYJZp6hHL4xq91UtvfKe3Tli\nxzMADoZ9DJwIe8hQJTq3M4WSjmdefNe9B91xIlp9iJBgNKrkIb4RFbFl/7YDgiq+\nz+B2CMCun4Tbj1UJMJ808kgKYX16+6swTOM7zxpGRw3X1x7puDd8hzUzSgVhy6Up\nfPmPmedQGGtwvhPI3VVx/GRdsdbKZx2AGyXM6oxn2QKBgQDr8Lw8EDzn3TilHdCs\n87ShXlCtsE0CYahKRN76nkc1y1mcYW/USd3+vlueGQNdJT8JB3R2FQxGyfd+5jZR\n99Pq5OGOmri8GPyoNNQtM0PxxhiugYC5fePHA/sX5J2okYy2WIBlujcwTgx9zLTd\n/uKJKBdWKTrouvvTHOjLmwbvuQKBgQC3SVexEY9urUhBS7oyVVAqjo/DigcSBFBN\nmoXanS4OKs32ZLF/2naITmHTpi+T36fMIb4ncg7xLwhhm8POy4HRIrpoQmVr9auX\nnxqupBGHbAWxp7Mkcy84qvEa9XHO8+H6yvxM1s1XNAAFYSp4E7eNJRXoAuO7Q5XV\nw+YLQrEAAwKBgESHMHUVlksWEuzKYyDIzA8OkMpR6ZwmdzXTGRybuj0iqg1ks5Fq\nPwNNkNizlSmJtuxNcQMXC/DHmo4OGXrnS3LvNaAwyjU/4KqOZY4XVMW1btfIn3XA\n3dahDl4bNbuPQtp3jBt/4aWzFae4PFQ6QtvpfBW3dffAz4G65Na2WWZpAoGBALAW\ne3Q3bbikK/3ndixzQECSlFYFXsOVd10HLsAYMC4WO6gTl2BBD43m2B+R0rXbswbw\nCBM3hll6mS/FiXo8lCzLk5Ek8PGmpcNWbTkJkXmsc0/50KcdLmnf+SGwWzW7owji\nSUC9Qawc3kRM1JNmRfsJfSFY3VeFGAe2XGXHHevnAoGAcTaI+V+6yxcUzwEqfpBO\n0qIlFqpqNyNCkhInHnL5lUGMfWh/D9yPScsjdDZ8GWTyvJRL4k2B+JNvLNdzanH5\nCftMAx7NFCxH3xzNhXR0JfqpiloskD33IqMK5waeJf+5ncss2lNJvJB/6iUp57dH\n8EUJjxT8IstD6HJnJlssRy4=\n-----END PRIVATE KEY-----\n",
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
