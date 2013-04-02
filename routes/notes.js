var Note = require('../models/models.js').noteModel,
    ensureAuthenticated = require('../lib/utils').ensureAuthenticated;

function notes(app) {

    //Find all user notes
    app.get('/notes', ensureAuthenticated, function(req, res) {
        console.log('Find all user notes');
        Note.find({_user:req.user._id}, function(error, data){
            if (error) {
                console.log("Error by finding notes");
                res.send({"Status":"Error"});
            }
            res.send(data);
        });
    });

    // Add new note
    app.post('/notes', ensureAuthenticated, function(req, res) {
        var note = req.body;
        note._user = req.user._id;
        var save_note = new Note(note);
        console.log('Add note: ' + JSON.stringify(note));
        save_note.save(function(err){
            if (err) {
                console.log("Error by saving note");
                res.send({"Status":"Error"});
            }
            console.log("Note was saved");
            res.send({"_id":save_note._id});
        });
    });

    //Find note by id
    app.get('/notes/:id', ensureAuthenticated, function(req, res) {
        var id = req.params.id;
        console.log('Find note by id: ' + id);
        Note.find({_id:id}, function(error, data){
            if(error) {
                console.log("Error finding note by id :" + id);
                res.send({"Status":"Error"});
            }
            res.send(data);
        });
    });

    // Update note
    app.patch('/notes/:id', ensureAuthenticated, function(req, res) {
        var note = req.body;
        var id = req.params.id;
        delete note._id;
        console.log('Update note: ' + JSON.stringify(note));
        Note.update({_id:id}, note, {safe:true}, function(error, affected) {
            if (error) {
                console.log("Error update note");
                res.send({"Status":"Error"});
            }
            if(affected === 0) {
                res.send({"Status":"Error"});
            }
            res.send({"Status":"Success"});
        });
    });

    //Delete note
    app.delete('/notes/:id', ensureAuthenticated, function(req, res) {
        var id = req.params.id;
        console.log('Delete note by id: ' + id);
        Note.remove({_id:id}, function(error) {
            if (error) {
                res.send("Fail delete note");
                res.send({"Status":"Error"});
            }
            console.log("Note was deleted");
            res.send({"Status":"Success"});
        });
    });

    //Counting all user notes
    app.get('/notes/notesCount', ensureAuthenticated, function(req, res) {
        console.log('Get all notes count');
        Note.count({_user:req.user._id}, function(error, count){
            if (error) {
                console.log("Error by counting notes");
                res.send({"Status":"Error"});
            }
            res.send({count:count});
        });
    });
}

module.exports = notes;

