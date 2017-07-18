var FacebookStrategy = require('passport-facebook').Strategy;
var authConfig = require('./config/facebook-config');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log(user);
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log(id);
    });
    
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : authConfig.facebookAuth.clientID,
        clientSecret    : authConfig.facebookAuth.clientSecret,
        callbackURL     : authConfig.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {
            console.log(profile);
        });
    }));
}