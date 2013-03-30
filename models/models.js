var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//User Schema, relationship:
// User:Note -  1:M
var userSchema = Schema({
    username: {type: String, required: false},
    password: {type: String, required: true},
    email: {type:String, required: true, unique: true},
    creationDate: {type: Date, default: Date.now},
    notes: [{type: Schema.Types.ObjectId, ref: 'Note'}],
    events: [{type: Schema.Types.ObjectId, ref: 'Event'}],
    tasks:[{type:Schema.Types.ObjectId, ref:'Task'}]
});

//Note Schema, M:1 to User
var noteSchema = Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    creationDate: {type: Date, default: Date.now}
});

var taskSchema = Schema({
    _user: {type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    description: String,
    creationDate: {type: Date, default: Date.now},
    taskDate: {type: Date, default: Date.now},
    priority: Number,
    state: Boolean   // Active or not
});

var eventSchema = Schema({
    _user: {type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    description: String,
    creationDate: {type: Date, default: Date.now},
    eventDate: {type: Date, default: Date.now},
    priority: Number,
    state: Boolean    //Active or not
});


//Simple valid password method
userSchema.methods.validPassword = function(password, done) {
    if (this.password === password) {
        return done(null, this);
    } else {
        return done(null, false, {
            message: 'Invalid Password'
        });
    }
};

var Note = mongoose.model('Note', noteSchema);
var Task = mongoose.model('Task', taskSchema);
var Event = mongoose.model('Event', eventSchema);
var User =  mongoose.model('User', userSchema);

//Add test user data to bd
function testUserInit() {

    for(var i=0; i<5; i++) {
        var testUser = new User({username:"Bob"+i, password:"123", email:"test" + i +"@mail.com"});

        testUser.save(function(err){
            if (err) {
                console.log("Error saved");
                throw err;
            }

            //Test note init
            var note = new Note({
                _user : testUser._id,
                title : "Test note" + i,
                description: "Test note description"
            });

            var task = new Task({
                _user : testUser._id,
                title : "Test task" + i,
                description: "Task description here",
                priority: i,
                state: true    //Active or not
            });

            var event = new Event({
                _user : testUser._id,
                title : "Test Event" + i,
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

//testUserInit();

exports.userModel = User;
exports.userSchema = userSchema

exports.noteModel = Note;
exports.noteSchema = noteSchema

exports.taskModel = Task;
exports.taskSchema = taskSchema;

exports.eventModel = Event;
exports.eventSchema = eventSchema;
