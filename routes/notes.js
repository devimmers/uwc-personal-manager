var Note = require('../models/models.js').noteModel;

//Find all user notes
exports.findUserNotes = function(req, res) {
    console.log('Find all user notes');
    Note.find({_user:req.user._id}, function(error, data){
        if (error) {
            console.log("Error by finding notes");
        }
        res.send(data);
    });
};

// Add new note
exports.addNote = function(req, res) {
    var note = req.body;
    note._user = req.user._id;
    var save_note = new Note(note);
    console.log('Add note: ' + JSON.stringify(note));
    save_note.save(function(err){
        if (err) {
            console.log("Error by saving note");
            res.send("Fail");
            throw err;
        }
        console.log("Note was saved");
        res.send({"_id":save_note._id});
    });
};

//Find note by id
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Find note by id: ' + id);
    Note.find({_id:id}, function(error, data){
        if(error) {
            console.log("Error finding note by id :" + id);
        }
        res.send(data);
    });
};

// Update note
exports.updateNote = function(req, res) {
   // var id = req.params.id;
    var note = req.body;
    var id = req.params.id;
    delete note._id;
    console.log('Update note: ' + JSON.stringify(note));
    Note.update({_id:id}, note, {safe:true}, function(error) {
        if (error) {
            console.log("Error update note");
        }
        res.send("Success")
    });

};

//Delete note
exports.deleteNote = function(req, res) {
    var id = req.params.id;
    console.log('Delete note by id: ' + id);
    Note.remove({_id:id}, function(error) {
        if (error) {
            res.send("Fail delete note");
        }
        console.log("Note was deleted");
        res.send("Succesed");
    });
};

//Counting all user notes
exports.notesCount = function(req, res) {
    console.log('Get all notes count');
    Note.count({_user:req.user._id}, function(error, count){
        if (error) {
            console.log("Error by counting notes");
        }
        res.send({count:count});
    });
};

