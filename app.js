var express = require('express'),
    path = require('path'),
    http = require('http');

var config = require('./config').config,
    users = require('./routes/users'),
    notes = require('./routes/notes'),
    tasks = require('./routes/tasks'),
    events = require('./routes/events'),
    eventAndTasks = require('./routes/event-and-task'),
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

app.get('/auth/facebook', passport.authenticate('facebook'),
    function(req, res){
});

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
});


// POST login or registration method
app.post('/enter', users.login);
//Get user token
app.get('/enter', users.getToken);
//Get logout action
app.delete('/enter', users.logout);

//Note area
//Get list all user notes
app.get('/notes', ensureAuthenticated, notes.findUserNotes);
// Find note by id
app.get('/notes/:id', ensureAuthenticated, notes.findById);
//Add new note
app.post('/notes', ensureAuthenticated, notes.addNote);
// Update note
app.patch('/notes/:id', ensureAuthenticated, notes.updateNote);
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
app.post('/tasks', ensureAuthenticated, tasks.addTask);
// Update task
app.patch('/tasks/:id', ensureAuthenticated, tasks.updateTask);
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
app.post('/events', ensureAuthenticated, events.addEvent);
// Update event
app.patch('/events/:id', ensureAuthenticated, events.updateEvent);
//Delete event
app.delete('/events/:id', ensureAuthenticated, events.deleteEvent);
//Tasks count
app.get('/events/eventsCount', ensureAuthenticated, events.eventsCount);

//Get full list
app.get('/list', ensureAuthenticated, eventAndTasks.findEventAndTask);
//Add new event
app.post('/list', ensureAuthenticated, eventAndTasks.addItem);

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