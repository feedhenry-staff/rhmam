module.exports = {
  listTask: listTask,
  newTask: newTask,
  deleteTask: deleteTask,
  mam_getTasks: mam_getTasks,
  mam_replyTask:mam_replyTask,
  mam_getTaskParams:mam_getTaskParams
};

var Task = require("../../models").Task;
var async = require("async");
var log = require("../../log");

function mam_getTaskParams(req,res,next){
  var id=req.params.taskId;
  Task.findById(id,function(err,doc){
    if (err){
      next(err);
    }else{
      res.json(doc.params);
    }
  });
}
function mam_replyTask(req,res,next){
  var uuid=req.device.uuid;
  var taskId=req.params.taskId;
  var msg=req.body.msg;
  var success=req.body.success?true:false;
  Task.findOneAndUpdate({
    deviceUuid:uuid,
    _id:taskId
  },{
    completeDate:new Date(),
    status:success?"completed":"error",
    replyMsg:msg
  },function(err){
    if (err){
      next(err);
    }else{
      res.end();
    }
  });
}
function mam_getTasks(req, res, next) {
  var uuid = req.device.uuid;
  async.waterfall([
    function(scb) {
      Task.find({
        deviceUuid: uuid,
        status: "new"
      }, "_id task", function(err, r) {
        scb(err, r);
      });
    },
    function(r, scb) {
      Task.update({
        deviceUuid: uuid,
        status: "new"
      }, {
        status: "dispatched",
        dispatchDate:new Date()
      }, function(e) {
        scb(e, r);
      });
    }
  ], function(err, list) {
    if (err) {
      next(err);
    } else {
      res.json(list);
    }
  });
}


function listTask(req, res, next) {
  var args = {};
  if (req.query && req.query.uuid) {
    args.deviceUuid = req.query.uuid;
  }
  Task.find(args).sort("-createDate").exec(function(err, r) {
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
        t.save(function(err) {
          if (err) {
            next(err);
          } else {
            res.end();
          }
        })
      } else {
        next(new Error("Not found"));
      }
    }
  });
}
