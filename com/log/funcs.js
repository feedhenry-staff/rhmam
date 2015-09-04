module.exports = {
  logs: logs,
  getTimestamp: getTimestamp,
  uploadLog: uploadLog

}
var Log = require("./models/Log");
var log = require("../../log");
var async = require("async");

function logs(data, cb) {
  var deviceUuid = data.deviceUuid;
  if (deviceUuid) {
    var args = {
      deviceUuid: deviceUuid,
      timestamp: {}
    }
    if (data.start) {
      args.timestamp.$gte = data.start;
    }
    if (data.end) {
      args.timestamp.$lt = data.end;
    }
    Log.find(args).sort({
      timestamp: -1
    }).exec(cb);
  } else {
    cb(new Error("Device UUID should be provided to list logs."));
  }
}

function getTimestamp(data, cb) {
  var deviceUuid = data.deviceUuid;
  if (deviceUuid) {
    Log.findOne({
      deviceUuid: deviceUuid
    }).select("timestamp").sort({
      timestamp: -1,
      _id: -1
    }).exec(cb);
  } else {
    cb(new Error("Device UUID should be provided to get timestamp"));
  }
}

function uploadLog(data, cb) {
  var logsText = data.logs;
  var logs = JSON.parse(logsText); //TODO add try catch in case log text corruption
  var deviceUuid = data.deviceUuid;
  if (deviceUuid) {
    var start = data.start ? data.start : 0;
    var end = data.end ? data.end : 0;
    var removeArgs = {
      timestamp: {
        $gte: start,
        $lt: end
      }
    }
    Log.remove(removeArgs, function(err) { //remove the logs for the time range
      if (err) {
        cb(err);
      } else {
        logs.forEach(function(l) {
          l.deviceUuid = deviceUuid;
        });
        Log.create(logs, function(err){
          cb(err);
        });
      }
    });
  } else {
    cb(new Error("Device UUID should be provided to get timestamp"));
  }
}
