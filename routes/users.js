var User = require('../models/models.js').userModel,
    passport = require('passport');

//Logout action
exports.logout = function(req, res) {
    req.logOut();
    res.send({'status':'Success'});
};

//Login action
exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            req.session.messages =  [info.message];
            if(req.session.messages[0] === 'Unknown User' && req.body.status == 'new') {
                var userBody = req.body;
                var newUser = new User(userBody);
                console.log('Add user: ' + JSON.stringify(newUser));
                newUser.save(function(err){
                    if (err) {
                        console.log("Error saved");
                        res.send("Fail");
                    }
                    console.log("Saved");
                    req.login(newUser, function(err) {
                        if (err) {
                            return req.send({"Status":"Error"});
                        }
                        return res.send({"token":newUser.get('accessToken')});
                    });
                });
                (req, res, next);
            } else {
                return res.send(req.session.messages);
            }
        }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send({"token":user.get('accessToken')});
        });
    })(req, res, next);

};

//Return user token
exports.getToken = function(req, res) {
    if(req.user) {
        var token = req.user.accessToken;
    }
    res.send({token:token});
};

// Add new user
exports.register = function(req, res) {
    var userBody = req.body;
    var newUser = new User(userBody);
    console.log('Add user: ' + JSON.stringify(newUser));
    newUser.save(function(err){
        if (err) {
            console.log("Error saved");
            res.send("Fail");
        }
        console.log("Saved");
        req.login(newUser, function(err) {
            if (err) {
                return req.send({"Status":"Error"});
            }
            return res.send({'token':newUser.get('accessToken')});
        });
    });
};
