var Event = require('../models/models.js').eventModel,
    Task = require('../models/models.js').taskModel,
    ensureAuthenticated = require('../lib/utils').ensureAuthenticated;

function list(app) {

    //Find all user events and tasks
    app.get('/list', ensureAuthenticated, function (req, res) {
        console.log('Find all user tasks and events');
        var result = new Array();
        addEvents(req, result);
        addTasks(req, res, result);
    });

    //add all events to list
    function addEvents(req, result) {
        Event.find({_user: req.user._id}, function (error, data) {
            if (error) {
                console.log("Error by finding all events");
            } else {
                for (var i = 0; i < data.length; ++i) {
                    data[i]._doc.type = "Event";
                    result.push(data[i]);
                }
            }
        });
    }

    //Add all tasks to list
    function addTasks(req, res, result) {
        Task.find({_user: req.user._id}, function (error, data) {
            if (error) {
                console.log("Error by finding all events");
                res.send({"Status":"Error"});
            } else {
                for (var i = 0; i < data.length; ++i) {
                    data[i]._doc.type = "Task";
                    result.push(data[i]);
                }
                res.send(result);
            }
        });
    }

}

module.exports = list;