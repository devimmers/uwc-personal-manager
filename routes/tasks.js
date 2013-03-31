var Task = require('../models/models.js').taskModel,
    ensureAuthenticated = require('../lib/utils').ensureAuthenticated;

function tasks(app) {

    //Find all user tasks
    app.get('/tasks', ensureAuthenticated, function(req, res) {
        console.log('Find all user Task');
        Task.find({_user:req.user._id}, function(error, data){
            if (error) {
                console.log("Error by finding all tasks");
            }
            res.send(data);
        });
    });

    //Find task by id
    app.get('/tasks/:id', ensureAuthenticated, function(req, res) {
        var id = req.params.id;
        console.log('Find by id: ' + id);
        Task.find({_id:id}, function(error, data){
            if(error) {
                console.log("Error finding by id :" + id);
            }
            res.send(data);
        });
    });

    // Add new Task
    app.post('/tasks', ensureAuthenticated, function(req, res) {
        var task = req.body;
        task._user = req.user._id;
        var save_task = new Task(task);
        console.log('Add task: ' + JSON.stringify(task));
        save_task.save(function(err){
            if (err) {
                console.log("Error by save task");
                res.send("Fail");
            }
            console.log("Task was saved");
            res.send({"_id":save_task._id});
        });
    });


    // Update task
    app.patch('/tasks/:id', ensureAuthenticated, function(req, res) {
        var task = req.body;
        var id = req.params.id;
        delete task._id;
        console.log('Update task: ' + JSON.stringify(task));
        Task.update({_id:id}, task, {safe:true}, function(error, affected) {
            if (error) {
                console.log("Error update task");
            }
            if(affected === 0) {
                res.send("Fail");
            }
            res.send("Success");
        });
    });

    //Delete task
    app.delete('/tasks/:id', ensureAuthenticated, function(req, res) {
        var id = req.params.id;
        console.log('Delete task by id: ' + id);
        Task.remove({_id:id}, function(error) {
            if (error) {
                res.send("Fail delete task");
            }
            console.log("Task was deleted");
            res.send("Succesed");
        });
    });

    //Counting all user tasks
    app.get('/tasks/tasksCount', ensureAuthenticated, function(req, res) {
        console.log('Get all tasks count');
        Task.count({_user:req.user._id}, function(error, count){
            if (error) {
                console.log("Error by counting tasks");
            }
            res.send({count:count});
        });
    });
}

module.exports = tasks;
