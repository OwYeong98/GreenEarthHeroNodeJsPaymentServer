var log = require('bole')('stripepayment/router')
var router = require('express').Router()
var jsonFormatter = require('../../jsonRespondFormat')
const { check, validationResult } = require('express-validator');

var stripe = require('stripe')(process.env.STRIPE_SERVER_API_KEY);
const admin = require('firebase-admin');

router.get('/initializePaymentIntent', [
    check('itemIdToPurchase','Item Id cannot be empty!').exists(),
    check('locationId','Location Id cannot be empty!').exists()
  ],
  async function initializeStripePaymentIntent (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      new jsonFormatter().respondWithError(res,errors.array(),new jsonFormatter().CODE_FORBIDDEN)
      return
    }

    var idToken = req.query.firebaseToken
    var firebaseUserId = await admin.auth().verifyIdToken(idToken)
      .then(function(decodedToken) {
          //found user id
          let uid = decodedToken.uid;
  
          return uid
      })
    
    var itemDetail = await admin.firestore().collection("Second_Hand_Item").doc(req.query.itemIdToPurchase).get()
      .then(doc => {
          if (!doc.exists) {
            return null
          } else {
            return doc;
          }
      }).catch(err=>{
          return null
      })
    var locationDetail = await admin.firestore().collection("Location").doc(req.query.locationId).get()
      .then(doc => {
          if (!doc.exists) {
            return null
          } else {
            return doc;
          }
      }).catch(err=>{
          return null
      })
    
    if(itemDetail == null || locationDetail == null){
      var errors= []

      if(itemDetail == null){
        errors.push('Error getting item detail, Please make sure item id is valid!')
      }

      if(locationDetail == null){
        errors.push('Error getting location detail, Please make sure location id is valid!')
      }

      new jsonFormatter().respondWithError(res,errors,new jsonFormatter().CODE_BAD_REQUEST)
    }else{
      //store firebase user id to metadata so we can know who purchase the item when stripe send webhook payment successfully done
      const paymentIntent = await stripe.paymentIntents.create({
        amount: itemDetail.data().itemPrice*100,
        currency: 'myr',
        payment_method_types: ['card'],
        metadata: {itemId:req.query.itemIdToPurchase,firebaseUser: firebaseUserId,locationId:locationDetail.id}
      });
      new jsonFormatter().respondWithData(res,{secret:paymentIntent.client_secret})
    }
  }
)




router.get('/webhook', function(req,res){
    let event;
    const sig = req.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        var firebaseUserId= paymentIntent.metadata.firebaseUser;
        var locationId = paymentIntent.metadata.locationId;
        var itemId = paymentIntent.metadata.itemId;

        log.info(`webhook received userID: ${firebaseUserId} | locId: ${locationId} | itemId: ${itemId}`)

        let documentRef = admin.firestore().doc('Second_Hand_Item/'+itemId);

        documentRef.update({deliveryLocationId: locationId,boughtBy: firebaseUserId}).then(res => {
          console.log(`Document updated at ${res.updateTime}`);
        });
        break;
        
      default:
        // Unexpected event type
        return response.status(400).end();
    }

    // Return a response to acknowledge receipt of the event
    response.json({received: true});
})
router.get('/testerrorhaha', function(req,res){
    new jsonFormatter().respondWithError(res,"Sorry input invalid",new jsonFormatter().CODE_UNAUTHORIZED)
})
router.get('/testdatahaha', function(req,res){
  // key = {
  //   "type": "service_account",
  //   "project_id": "greenearthhero-cceb4",
  //   "private_key_id": "c46e0ca9ed7e63be4b4c813a476a0d026177f0f3",
  //   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCo7K8GnlXoI3ZF\nsXIf0axgat74bR9c28U2a9P8GYXY2QIozzGWssztsOghK8S9YXIQqcQdZfpEaC9O\ndZB/L3UnyYuQpa1E/0St2OEtyPt7DZA0y1GC5EiCHCgvmsW6T8hvhwiZ9qYbSyOk\ncn0mzgxsdIUo02NhzkwokONdssrVjDJZ4W4xe3yFcfyzLAaZnlvEjq6RNB9iOAgm\nMjQD7pZi0woos71YNucYzeZoW3Tm1CfIq6u9IThM9DmMdZNSmFEIDeZ8vIOFOiG2\ngvoT5JchDOOt6FFR8G9AENa08fdoBqzLj0CCnXzb+bL52oW/kRAu25b23qdXZ1es\nNu9B/c8rAgMBAAECggEAEoNiCUEoHBlq2GeCoO8bS7PavPJEqioh2n2FzY7Ehwf9\nfxh6EFCHOhOV1TDVToYT+LSKXEh1XbLnYFttGytJ1TL2+0LVEwdA8SagQyLQQOOz\nJr4TsFsxgSTx2InHWsxspKBxdmI8QSiCfv7XLX4OiYJZp6hHL4xq91UtvfKe3Tli\nxzMADoZ9DJwIe8hQJTq3M4WSjmdefNe9B91xIlp9iJBgNKrkIb4RFbFl/7YDgiq+\nz+B2CMCun4Tbj1UJMJ808kgKYX16+6swTOM7zxpGRw3X1x7puDd8hzUzSgVhy6Up\nfPmPmedQGGtwvhPI3VVx/GRdsdbKZx2AGyXM6oxn2QKBgQDr8Lw8EDzn3TilHdCs\n87ShXlCtsE0CYahKRN76nkc1y1mcYW/USd3+vlueGQNdJT8JB3R2FQxGyfd+5jZR\n99Pq5OGOmri8GPyoNNQtM0PxxhiugYC5fePHA/sX5J2okYy2WIBlujcwTgx9zLTd\n/uKJKBdWKTrouvvTHOjLmwbvuQKBgQC3SVexEY9urUhBS7oyVVAqjo/DigcSBFBN\nmoXanS4OKs32ZLF/2naITmHTpi+T36fMIb4ncg7xLwhhm8POy4HRIrpoQmVr9auX\nnxqupBGHbAWxp7Mkcy84qvEa9XHO8+H6yvxM1s1XNAAFYSp4E7eNJRXoAuO7Q5XV\nw+YLQrEAAwKBgESHMHUVlksWEuzKYyDIzA8OkMpR6ZwmdzXTGRybuj0iqg1ks5Fq\nPwNNkNizlSmJtuxNcQMXC/DHmo4OGXrnS3LvNaAwyjU/4KqOZY4XVMW1btfIn3XA\n3dahDl4bNbuPQtp3jBt/4aWzFae4PFQ6QtvpfBW3dffAz4G65Na2WWZpAoGBALAW\ne3Q3bbikK/3ndixzQECSlFYFXsOVd10HLsAYMC4WO6gTl2BBD43m2B+R0rXbswbw\nCBM3hll6mS/FiXo8lCzLk5Ek8PGmpcNWbTkJkXmsc0/50KcdLmnf+SGwWzW7owji\nSUC9Qawc3kRM1JNmRfsJfSFY3VeFGAe2XGXHHevnAoGAcTaI+V+6yxcUzwEqfpBO\n0qIlFqpqNyNCkhInHnL5lUGMfWh/D9yPScsjdDZ8GWTyvJRL4k2B+JNvLNdzanH5\nCftMAx7NFCxH3xzNhXR0JfqpiloskD33IqMK5waeJf+5ncss2lNJvJB/6iUp57dH\n8EUJjxT8IstD6HJnJlssRy4=\n-----END PRIVATE KEY-----\n",
  //   "client_email": "firebase-adminsdk-rcbb9@greenearthhero-cceb4.iam.gserviceaccount.com",
  //   "client_id": "109057861235365413275",
  //   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  //   "token_uri": "https://oauth2.googleapis.com/token",
  //   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  //   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rcbb9%40greenearthhero-cceb4.iam.gserviceaccount.com"
  // }

  let db = admin.firestore();

  db.collection('Users').doc('0jlJBnwvMhdkOLROuLVDotDvKqu2').get().then(function(doc) {
    new jsonFormatter().respondWithData(res,{id:doc.id,premailo:doc.data().email,asd:"asdfg"})
  });


    
})




module.exports = router