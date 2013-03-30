var User = require('./models/models').userModel,
     passport = require('passport'),
     LocalStrategy = require('passport-local').Strategy;

module.exports = function() {
    //Login strategy
    passport.use(new LocalStrategy(
        {
            usernameField:'email'
        },
        function(email, password, done) {
            User.findOne({'email': email}, function(err, user) {
                if (err) {
                    return done(err);
                } else if (!user) {
                    return done(null, false, { message: 'Uknown User' });
                } else {
                    return user.validPassword(password, done);
                }
            });
        }
    ));

    //Passport settings
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}