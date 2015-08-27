module.exports = {
  listTask: listTask,
  newTask: newTask,
  deleteTask: deleteTask
};

var Task = require("../../models").Task;

function listTask(req, res, next) {
  Task.find({}, function(err, r) {
    if (err) {
      next(err);
    } else {
      res.json(r);
    }
  });
}

function newTask(req, res, next) {
  var task = new Task(req.body);
  task.save(function(err) {
    if (err) {
      next(err);
    } else {
      res.end();
    }
  });
}

function deleteTask(req, res, next) {
  var taskId = req.params.taskId;
  Task.findOne({
    _id: taskId
  }, function(err, t) {
    if (err) {
      next(err);
    } else {
      if (t) {
        t.status = "deleted";
        t.save(function(err){
          if (err){
            next(err);
          }else{
            res.end();
          }
        })
      } else {
        next(new Error("Not found"));
      }
    }
  });
}
