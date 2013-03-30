var User = require('../models/models.js').userModel;

exports.logout = function(req, res) {
    req.logOut();
    res.redirect('/');
};

// Add new user
exports.register = function(req, res) {
    var user = req.body;
    var newUser = new User(user);
    console.log('Add user: ' + JSON.stringify(newUser));
    newUser.save(function(err){
        if (err) {
            console.log("Error by save user");
            res.send("Fail");
            throw err;
        }
        console.log("User was saved");
        res.send("Succesed");
        res.redirect('/login');
    });
};
