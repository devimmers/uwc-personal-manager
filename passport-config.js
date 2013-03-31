var User = require('./models/models').userModel,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('./config').config;

module.exports = function () {
    //Login strategy
    passport.use(new LocalStrategy(
        {
            usernameField: 'email'
        },
        function (email, password, done) {
            User.findOne({'email': email}, function (err, user) {
                if (err) {
                    return done(err);
                } else if (!user) {
                    return done(null, false, { message: 'Unknown User' });
                } else {
                    return user.validPassword(password, done);
                }
            });
        }
    ));

    passport.use(new FacebookStrategy({
        clientID: config.facebook.id,
        clientSecret: config.facebook.secret,
        callbackURL: "http://" + config.app.url + ':' + config.app.port + '/auth/facebook/callback'
    }, function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            console.log(profile);
            console.log(accessToken);

               User.findOne({ 'facebookId': profile.id }, function (err, user) {
                    if (user === null) {
                        var newUser = new User({
                            facebookId: profile.id,
                            provider: "facebook",
                            firstName:  profile.name.familyName,
                            lastName: profile.name.givenName,
                            sex: profile.gender
                        });
                        newUser.save(function (err) {
                            if(err) {
                                console.log("Error saving user");
                            }
                            done(null, newUser);
                        });
                    } else {
                        done(null, user);
                    }
                });

            return done(null, profile);
        });
    }));


    //Passport settings
    passport.serializeUser(function (user, done) {
        var createAccessToken = function () {
            var token = user.generateRandomToken();
            User.findOne({ accessToken: token }, function (err, existingUser) {
                if (err) {
                    return done(err);
                }
                if (existingUser) {
                    createAccessToken(); // Run the function again - the token has to be unique!
                } else {
                    user.set('accessToken', token);
                    user.save(function (err) {
                        if (err) return done(err);
                        return done(null, user.get('accessToken'));
                    })
                }
            });
        };

        if (user._id) {
            createAccessToken();
        }
    });

    passport.deserializeUser(function (token, done) {
        User.findOne({accessToken: token }, function (err, user) {
            done(err, user);
        });
    });
}

