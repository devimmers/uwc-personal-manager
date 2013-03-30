var Task = require('../models/models.js').taskModel;

//Find all user tasks
exports.findUserTasks = function(req, res) {
    console.log('Find all user Task');
    Task.find({_user:req.user._id}, function(error, data){
        if (error) {
            console.log("Error by finding all tasks");
        }
        res.send(data);
    });
};

// Add new Task
exports.addTask = function(req, res) {
    var task = req.body;
    task._user = req.user._id;
    var save_task = new Task(task);
    console.log('Add task: ' + JSON.stringify(task));
    save_task.save(function(err){
        if (err) {
            console.log("Error by save task");
            res.send("Fail");
            throw err;
        }
        console.log("Task was saved");
        res.send("Succesed");
    });
};

//Find task by id
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Find by id: ' + id);
    Task.find({_id:id}, function(error, data){
        if(error) {
            console.log("Error finding by id :" + id);
        }
        res.send(data);
    });
};

// Update task
exports.updateTask = function(req, res) {
    var id = req.params.id;
    var task = req.body;
    console.log('Update task: ' + JSON.stringify(task));
    Task.update({_id:id}, task, {safe:true}, function(error, result) {
        if (error) {
            console.log("Error update task");
        }
        res.send(result);
    });
};

//Delete task
exports.deleteTask = function(req, res) {
    var id = req.params.id;
    console.log('Delete task by id: ' + id);
    Task.remove({_id:id}, function(error) {
        if (error) {
            res.send("Fail delete task");
        }
        console.log("Task was deleted");
        res.send("Succesed");
    });
};
