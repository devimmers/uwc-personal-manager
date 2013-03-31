var express = require('express'),
    path = require('path'),
    http = require('http');

var config = require('./config').config,
    users = require('./routes/users'),
    notes = require('./routes/notes'),
    tasks = require('./routes/tasks'),
    events = require('./routes/events'),
    list = require('./routes/event-and-task'),
    passportConfig = require("./passport-config"),
    passport = require('passport'),
    mongoose = require('mongoose');

//Open mongo connection
mongoose.connect(config.mongo.adress);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected to DB');
});

var app = express();

//App config
app.configure(function () {
    app.set('port', config.app.port || 3000);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.favicon());
    app.use(express.methodOverride());
    app.use(express.cookieParser('something simple this way walks'));
    app.use(express.session({secret: 'secret'}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(passport.initialize());
    app.use(passport.session());
    app.engine('html', require('ejs').__express);
    app.set('views', __dirname + '/public');
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

//Passport settings
passportConfig();

//Facebook login
app.get('/enter/facebook', passport.authenticate('facebook'),
    function (req, res) {}
);
//Facebook callback settings
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    }
);

//Users login/logout actions
users(app);
//Notes routes settings
notes(app);
//Task routes settings
tasks(app);
//Event routes settings
events(app);
//List routes settings
list(app);

app.get('/*', function (req, res) {
    res.render('index.html');
});

//Start app
app.listen(app.get('port'), function () {
    console.log("Server listening on port " + app.get('port'));
});
