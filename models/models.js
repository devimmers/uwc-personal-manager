var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//User Schema, relationship:
// User:Note -  1:M
var userSchema = Schema({
    username: String,
    password: String,
    email: String,
    note: [{type: Schema.Types.ObjectId, ref: 'Note'}]
});

//Note Schema, M:1 to User
var noteSchema = Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    creationDate: Date
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
var User =  mongoose.model('User', userSchema);

//Add test user data to bd
function testUserInit() {
    for(var i=0; i<5; i++) {
        var testUser = new User({username:"Bob"+i, password:"123", email:"test@mail.com"});

        testUser.save(function(err){
            if (err) {
                console.log("Error saved");
                throw err;
            }
            var note = new Note({
                _user : testUser._id,
                title    : "Test title",
                description: "Test description"
            });

            note.save(function (err) {
                if (err) return handleError(err);
            });

            console.log("Saved");
        });
    }
}

//testUserInit();

exports.userModel = User;
exports.userSchema = userSchema

exports.noteModel = Note;
exports.noteSchema = noteSchema