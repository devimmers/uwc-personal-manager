var express = require('express'),
    path = require('path'),
    http = require('http');

var config = require('./config').config,
    users = require('./routes/users'),
    notes = require('./routes/notes'),
    tasks = require('./routes/tasks'),
    events = require('./routes/events'),
    passportConfig = require("./passport-config"),
    passport = require('passport'),
    mongoose = require('mongoose');

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
    app.use(express.session());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(passport.initialize());
    app.use(passport.session());
    app.engine('html', require('ejs').__express);
    app.set('views', __dirname + '/public');
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

//Passport settings
passportConfig();

// POST /login
app.post('/login', passport.authenticate('local', { successRedirect: '/notes'}));
//Get logout action
app.get('/logout', users.logout);
//Get register action
app.post('/register', users.register);

//Note area
//Get list all user notes
app.get('/notes', ensureAuthenticated, notes.findUserNotes);
// Find note by id
app.get('/notes/:id', ensureAuthenticated, notes.findById);
//Add new note
app.post('/notes/addNote', ensureAuthenticated, notes.addNote);
// Update note
app.put('/notes/:id', ensureAuthenticated, notes.updateNote);
//Delete note
app.delete('/notes/:id', ensureAuthenticated, notes.deleteNote);
//Notes count
app.get('/notes/notesCount', ensureAuthenticated, notes.notesCount);

//Task area
//Get list all user tasks
app.get('/tasks', ensureAuthenticated, tasks.findUserTasks);
// Find task by id
app.get('/tasks/:id', ensureAuthenticated, tasks.findById);
//Add new task
app.post('/tasks/addTask', ensureAuthenticated, tasks.addTask);
// Update task
app.put('/tasks/:id', ensureAuthenticated, tasks.updateTask);
//Delete task
app.delete('/tasks/:id', ensureAuthenticated, tasks.deleteTask);
//Tasks count
app.get('/tasks/tasksCount', ensureAuthenticated, tasks.tasksCount);

//Event area
//Get list all user event
app.get('/events', ensureAuthenticated, events.findUserEvents);
// Find event by id
app.get('/events/:id', ensureAuthenticated, events.findById);
//Add new event
app.post('/events/addTask', ensureAuthenticated, events.addEvent);
// Update event
app.put('/events/:id', ensureAuthenticated, events.updateEvent);
//Delete event
app.delete('/events/:id', ensureAuthenticated, events.deleteEvent);
//Tasks count
app.get('/events/eventsCount', ensureAuthenticated, events.eventsCount);

app.get('/*',function(req,res) {
    res.render('index.html');
});

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