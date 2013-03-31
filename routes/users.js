var User = require('../models/models.js').userModel,
    passport = require('passport');

function users(app)  {

    //Login action
    app.post('/enter', authentication);

    function authentication (req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            // if not found user - check for error statuses
            if (!user) {
                req.session.messages =  [info.message];
                // if error status unknown and in body has status new - create new user
                if(req.session.messages[0] === 'Unknown User' && req.body.status == 'new') {
                    return registration(req,res,next);
                //If other error or don't have new parameter - return message
                } else {
                    return res.send(req.session.messages);
                }
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.send({"token":user.get('accessToken')});
            });
        })(req, res, next);
    }

    //Registration function for login
    function registration(req, res, next) {
        var userBody = req.body;
        var newUser = new User(userBody);
        console.log('Add user: ' + JSON.stringify(newUser));
        newUser.save(function(err){
            if (err) {
                console.log("Error saved");
                res.send({"Status":"Error"});
            }
            console.log("Saved");
            //auto login after registration
            req.login(newUser, function(err) {
                if (err) {
                    return req.send({"Status":"Error"});
                }
                // return token after login
                return res.send({"token":newUser.get('accessToken')});
            });
        });
    }

    //Logout action
    app.delete('/enter', function(req, res) {
        req.logOut();
        res.send({'status':'Success'});
    });

    //Return user token
    app.get('/enter', function(req, res) {
        if(req.user) {
            var token = req.user.accessToken;
        }
        res.send({token:token});
    });
}

module.exports = users;