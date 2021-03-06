var Event = require('../models/models.js').eventModel,
    ensureAuthenticated = require('../lib/utils').ensureAuthenticated;

function events(app) {

    //Find all user events
    app.get('/events', ensureAuthenticated, function(req, res) {
        console.log('Find all user events');
        Event.find({_user:req.user._id}, function(error, data){
            if (error) {
                console.log("Error by finding all events");
                res.send({"Status":"Error"});
            } else {
                res.send(data);
            }
        });
    });

    //Find event by id
    app.get('/events/:id', ensureAuthenticated, function(req, res) {
        var id = req.params.id;
        console.log('Find event by id: ' + id);
        Event.find({_id:id}, function(error, data){
            if(error) {
                console.log("Error finding event by id :" + id);
                res.send({"Status":"Error"});
            } else {
                res.send(data);
            }
        });
    });

    // Add new event
    app.post('/list/event', ensureAuthenticated, function(req, res) {
        var event = req.body;
        event._user = req.user._id;
        if(event.startDate != null) {
            event.startDate = new Date(event.startDate);
        }
        var save_event = new Event(event);
        console.log('Add event: ' + JSON.stringify(event));
        save_event.save(function(err){
            if (err) {
                console.log("Error by saving event");
                res.send({"Status":"Error"});
            } else {
                console.log("Event was saved");
                res.send({"_id":save_event._id});
            }
        });
    });

    // Update event
    app.patch('/list/event/:id', ensureAuthenticated, function(req, res) {
        var event = req.body;
        var id = req.params.id;
        delete event._id;
        if(event.startDate != null) {
            event.startDate = new Date(event.startDate);
        }
        console.log('Update event: ' + JSON.stringify(event));
        Event.update({_id:id}, event, {safe:true}, function(error, affected) {
            if (error) {
                console.log("Error by updating event");
                res.send({"Status":"Error"});
            } else if(affected === 0) {
                res.send({"Status":"Error"});
            } else {
                res.send({"Status":"Success"});
            }
        });
    });

    //Delete event
    app.delete('/list/event/:id', ensureAuthenticated, function(req, res) {
        var id = req.params.id;
        console.log('Delete event by id: ' + id);
        Event.remove({_id:id}, function(error) {
            if (error) {
                res.send({"Status":"Error"});
            } else {
                console.log("Event was Deleted");
                res.send({"Status":"Success"});
            }
        });
    });

    //Counting all user events
    app.get('/events/eventsCount', ensureAuthenticated, function(req, res) {
        console.log('Get all events count');
        Event.count({_user:req.user._id}, function(error, count){
            if (error) {
                console.log("Error by counting events");
                res.send({"Status":"Error"});
            } else {
                res.send({count:count});
            }
        });
    });
}

module.exports = events;