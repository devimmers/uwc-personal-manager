var Event = require('../models/models.js').eventModel;

//Find all user events
exports.findUserEvents = function(req, res) {
    console.log('Find all user events');
    Event.find({_user:req.user._id}, function(error, data){
        if (error) {
            console.log("Error by finding all events");
        }
        res.send(data);
    });
};

// Add new event
exports.addEvent = function(req, res) {
    var event = req.body;
    event._user = req.user._id;
    var save_event = new Event(event);
    console.log('Add event: ' + JSON.stringify(event));
    save_event.save(function(err){
        if (err) {
            console.log("Error by saving event");
            res.send("Fail");
            throw err;
        }
        console.log("Event was saved");
        res.send("Succesed");
    });
};

//Find event by id
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Find event by id: ' + id);
    Event.find({_id:id}, function(error, data){
        if(error) {
            console.log("Error finding event by id :" + id);
        }
        res.send(data);
    });
};

// Update event
exports.updateEvent = function(req, res) {
    var id = req.params.id;
    var event = req.body;
    console.log('Update event: ' + JSON.stringify(event));
    Event.update({_id:id}, event, {safe:true}, function(error, result) {
        if (error) {
            console.log("Error by updating event");
        }
        res.send(result);
    });
};

//Delete event
exports.deleteEvent = function(req, res) {
    var id = req.params.id;
    console.log('Delete event by id: ' + id);
    Event.remove({_id:id}, function(error) {
        if (error) {
            res.send("Error by delete event");
        }
        console.log("Event was Deleted");
        res.send("Succesed");
    });
};

//Counting all user events
exports.eventsCount = function(req, res) {
    console.log('Get all events count');
    Event.count({_user:req.user._id}, function(error, count){
        if (error) {
            console.log("Error by counting events");
        }
        res.send({count:count});
    });
};