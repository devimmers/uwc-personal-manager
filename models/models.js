var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//User Schema, relationship:
// User:Note -  1:M
// User:Event -  1:M
// User:Task -  1:M
var userSchema = Schema({
    username: {type: String, required: false},
    firstName: {type: String},
    lastName: {type: String},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    sex: {type: String},
    birthDate: {type: Date},
    creationDate: {type: Date, default: Date.now},
    accessToken: { type: String },
    facebookId: {type: String},
    provider: {type: String},
    notes: [
        {type: Schema.Types.ObjectId, ref: 'Note'}
    ],
    events: [
        {type: Schema.Types.ObjectId, ref: 'Event'}
    ],
    tasks: [
        {type: Schema.Types.ObjectId, ref: 'Task'}
    ]
});

//Note Schema, M:1 to User
var noteSchema = Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    updateDate: {type: Date},
    creationDate: {type: Date, default: Date.now}
});

//Task Schema, M:1 to User
var taskSchema = Schema({
    _user: {type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    description: String,
    creationDate: {type: Date, default: Date.now},
    startDate: {type: Date, default: Date.now},
    priority: Number,
    state: Boolean   // Active or not
});

//Event Schema, M:1 to User
var eventSchema = Schema({
    _user: {type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    description: String,
    creationDate: {type: Date, default: Date.now},
    startDate: {type: Date, default: Date.now},
    priority: Number,
    state: Boolean    //Active or not
});


//Simple valid password method
userSchema.methods.validPassword = function (password, done) {
    if (this.password === password) {
        return done(null, this);
    } else {
        return done(null, false, {
            message: 'Invalid Password'
        });
    }
};

userSchema.methods.findOrCreate = function (profile, facebookId, callback) {
    User.findOne({ 'facebookId': facebookId }, function (err, user) {
        if (user === null) {
            var newUser = new User({
                facebookId: facebookId,
                provider: "facebook",
                firstName:  profile.name.familyName,
                lastName: profile.name.givenName,
                sex: profile.gender
            });
            newUser.save(function (err) {
                callback(newUser);
            });
        } else {
            callback(user);
        }
    });
};

userSchema.methods.generateRandomToken = function () {
    var chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        token = new Date().getTime() + '_';
    for (var x = 0; x < 16; x++) {
        var i = Math.floor(Math.random() * 62);
        token += chars.charAt(i);
    }
    return token;
};

var Note = mongoose.model('Note', noteSchema);
var Task = mongoose.model('Task', taskSchema);
var Event = mongoose.model('Event', eventSchema);
var User = mongoose.model('User', userSchema);

//Add test user data to bd
function testUserInit() {
    for (var i = 0; i < 5; i++) {
        var testBithDate = new Date("October 1" + i + ", 1975 11:13:00")

        var testUser = new User({
            username: "Bob" + i,
            password: "123",
            email: "test" + i + "@mail.com",
            sex: "m",
            birthDate: testBithDate
        });

        testUser.save(function (err) {
            if (err) {
                console.log("Error saved");
                throw err;
            }
            var testUpdateDate = new Date("October 2" + i + ", 2013 11:13:00")

            //Test note init
            var note = new Note({
                _user: testUser._id,
                text: "Hey, here is test note",
                updateDate: testUpdateDate
            });

            var task = new Task({
                _user: testUser._id,
                title: "Test task" + i,
                description: "Task description here",
                priority: i,
                state: true    //Active or not
            });

            var event = new Event({
                _user: testUser._id,
                title: "Test Event" + i,
                description: "Event description here",
                priority: i,
                state: true    //Active or not
            });

            note.save(function (err) {
                if (err)
                    console.log("Error save note to test user");
            });

            task.save(function (err) {
                if (err)
                    console.log("Error save task to test user");
            });

            event.save(function (err) {
                if (err)
                    console.log("Error save event to test user");
            });

            console.log("User saved");
        });
    }
}

// testUserInit();

exports.userModel = User;
exports.userSchema = userSchema

exports.noteModel = Note;
exports.noteSchema = noteSchema

exports.taskModel = Task;
exports.taskSchema = taskSchema;

exports.eventModel = Event;
exports.eventSchema = eventSchema;
