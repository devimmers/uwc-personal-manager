var express = require('express'),
    path = require('path'),
    http = require('http');

var config = require('./config').config,
    users = require('./routes/users'),
    passportConfig = require("./passport-config"),
    passport = require('passport'),
    mongoose = require('mongoose');

var app = express();

//App config
app.configure(function () {
    app.set('port', config.app.port || 3000);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.favicon());
    app.use(express.methodOverride());
    app.use(express.cookieParser('something simple this way walks'));
    app.use(express.session());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function(req, res, next) {
        if(req.isAuthenticated()) {
            res.locals.user = req.user
        }
        var msgs = req.session.messages || []
        res.locals({
            messages: msgs,
            hasMessages: !! msgs.length
        })
        req.session.messages = []
        next()
    });
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

//Passport settings
passportConfig();

// POST /login
app.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
);
//Get logout action
app.get('/logout', users.logout);
//Get register action
app.post('/register', users.register);

//Start app
app.listen(app.get('port'), function() {
    console.log("Server listening on port " + app.get('port'));
});

//TODO:Add full session support and hash with sold
//Base chech for authentification
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}