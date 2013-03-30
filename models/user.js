var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
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

var userModel =  mongoose.model('User', userSchema);

//Add test user data to bd
function testUserInit() {
    for(var i=0; i<5; i++) {
        var testUser = new userModel({username:"Bob"+i, password:"123", email:"test@mail.com"});
        testUser.save(function(err){
            if (err) {
                console.log("Error saved");
                throw err;
            }
            console.log("Saved");
        });
    }
}

exports.model = userModel;
exports.Schema = userSchema
