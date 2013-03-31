var Event = require('../models/models.js').eventModel,
    Task = require('../models/models.js').taskModel,
    ensureAuthenticated = require('../lib/utils').ensureAuthenticated;

function list(app) {

    //Find all user events and tasks
    app.get('/list', ensureAuthenticated, function (req, res) {
        console.log('Find all user tasks and events');
        var result = new Array();
        Event.find({_user: req.user._id}, function (error, data) {
            if (error) {
                console.log("Error by finding all events");
            }
            for (var i = 0; i < data.length; ++i) {
                data[i]._doc.type = "event";
                result.push(data[i]);
            }
        });

        Task.find({_user: req.user._id}, function (error, data) {
            if (error) {
                console.log("Error by finding all events");
            }
            for (var i = 0; i < data.length; ++i) {
                data[i]._doc.type = "task";
                result.push(data[i]);
            }
            res.send(result);
        });
    });

    //Add task or event
    app.post('/list', ensureAuthenticated, function (req, res) {
        var item = req.body;
        item._user = req.user._id;
        if(item.type == 'event') {
            delete item.type;
            var save_event = new Event(item);
            console.log('Add event: ' + JSON.stringify(item));
            save_event.save(function (err) {
                if (err) {
                    console.log("Error by saving event");
                    res.send("Fail");
                }
                console.log("Event was saved");
                res.send({"_id": save_event._id});
            });

        } else if(item.type == 'task') {
            delete item.type;
            var save_task = new Task(item);
            console.log('Add task: ' + JSON.stringify(item));
            save_task.save(function(err){
                if (err) {
                    console.log("Error by save task");
                    res.send("Fail");
                }
                console.log("Task was saved");
                res.send({"_id":save_task._id});
            });
        }
    });
}

module.exports = list;