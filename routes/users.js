var User = require('../models/models.js').model;

//Logout action
exports.logout = function(req, res) {
    req.logOut();
    res.redirect('/');
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
    var user = req.body;
    var newUser = new User(user);
    console.log('Add user: ' + JSON.stringify(newUser));
    newUser.save(function(err){
        if (err) {
            console.log("Error saved");
            res.send("Fail");
            throw err;
        }
        console.log("Saved");
        res.send("Succesed");
        res.redirect('/login');
    });
};
