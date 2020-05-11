const admin = require('firebase-admin');
var jsonFormatter = require('../jsonRespondFormat')
const { check, validationResult } = require('express-validator');

module.exports = function(app,route){

    app.get(route, 
        [
            check('firebaseToken','Firebase Token cannot be empty!').exists()
        ],
        function(req,res,next){
            const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
                // Build your resulting errors however you want! String, object, whatever - it works!
                return `${msg}`;
              };
            const errors = validationResult(req).formatWith(errorFormatter);
            if (!errors.isEmpty()) {
                
                new jsonFormatter().respondWithError(res,errors.array(),new jsonFormatter().CODE_FORBIDDEN)
                return
            }

            var idToken = req.query.firebaseToken
            admin.auth().verifyIdToken(idToken)
            .then(function(decodedToken) {
                //found user id
                let uid = decodedToken.uid;
        
                next()
            }).catch(function(error) {
                // Handle firebase token not valid
                new jsonFormatter().respondWithError(res,"Firebase token not valid",new jsonFormatter().CODE_UNAUTHORIZED)
            });
        }
    )
    
}