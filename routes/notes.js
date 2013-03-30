var Note = require('../models/models.js').noteModel,
    config = require('../config.js').config;

//Find all user notes
exports.findUserNotes = function(req, res) {
    console.log('Find all user notes');
    Note.find({_user:req.user._id}, function(error, data){
        if (error) {
            console.log("Error");
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
            console.log("Eroro saved");
            res.send("Fail");
            throw err;
        }
        console.log("Saved");
        res.send("Succesed");
    });
};

//Find note by id
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Find by id: ' + id);
    Note.find({_id:id}, function(error, data){
        if(error) {
            console.log("Error finding by id :" + id);
        }
        res.send(data);
    });
};

// Update note
exports.updateNote = function(req, res) {
    var id = req.params.id;
    var note = req.body;
    console.log('Update note: ' + JSON.stringify(note));
    Note.update({_id:id}, note, {safe:true}, function(error, result) {
        if (error) {
            console.log("Error update");
        }
        res.send(result);
    });
};

//Delete note
exports.deleteNote = function(req, res) {
    var id = req.params.id;
    console.log('Delete note by id: ' + id);
    Note.remove({_id:id}, function(error) {
        if (error) {
            res.send("Fail delete");
        }
        console.log("Deleted");
        res.send("Succesed");
    });
};

