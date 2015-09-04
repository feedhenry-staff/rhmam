module.exports = {
  listComs: listComs,
  getCom: getCom,
  updateComConfig: updateComConfig,
  getComDeviceCfg: getComDeviceCfg,
  updateComDeviceCfg: updateComDeviceCfg,
  runCmd: runCmd_route,
  mam_getConfig: mam_getConfig,
  mam_runCmd: mam_runCmd
};

var Component = require("../../models").Component;
var async = require("async");
var Device = require("../../models").Device;
var log = require("../../log");


function runCmd_route(req, res, next) {
  var comId = req.params.comId;
  var cmd = req.params.cmd;
  var data = req.body ? req.body : {};
  runCmd(comId, cmd, data, function(err, r) {
    if (err) {
      log.error(err);
      next(err);
    } else {
      res.json(r);
    }
  });
}
function updateComDeviceCfg(req,res,next){
  var comId=req.params.comId;
  var deviceId=req.params.deviceId;
  var set={};
  set["config."+comId]=req.body;
  Device.findOneAndUpdate({
    uuid:deviceId
  },{
    $set:set
  },function(err){
    if (err){
      log.error(err);
      next(err);
    }else{
      res.end();
    }
  });
}

function getComDeviceCfg(req, res, next) {
  var comId = req.params.comId;
  var deviceId = req.params.deviceId;
  async.waterfall([
    function(scb) {
      Device.findOne({
        uuid: deviceId
      }, function(err, d) {
        if (err) {
          scb(err);
        } else {
          if (!d) {
            scb(new Error("Not found"));
          } else {
            scb(null, d);
          }
        }
      });
    },
    function(d, scb) {
      log.info("Load device config for %s of component %s", deviceId, comId, d.config);
      if (d.config[comId]) {
        log.silly("custom config found for %s of component %s", deviceId, comId);
        scb(null, d.config[comId]);
      } else {
        log.silly("custom config not found for %s of component %s", deviceId, comId);
        //load default config
        _loadComById(comId, function(err, r) {
          if (err) {
            scb(err);
          } else {
            scb(null, r.config);
          }
        });
      }
    }
  ], function(err, cfg) {
    if (err) {
      next(err);
    } else {
      log.silly("cfg found for %s of component %s", deviceId, comId, cfg);
      res.json(cfg);
    }
  });
}

function updateComConfig(req, res, next) {
  var comId = req.params.comId;
  _loadComById(comId, function(err, r) {
    if (err) {
      next(err);
    } else {
      r.config = req.body;
      r.save(function(err) {
        if (err) {
          next(err);
        } else {
          res.end();
        }
      });
    }
  });
}

function listComs(req, res, next) {
  Component.find({}).sort("_id").exec(function(err, r) {
    if (err) {
      next(err);
    } else {
      res.json(r);
    }
  });
}

function getCom(req, res, next) {
  var comId = req.params.comId;
  _loadComById(comId, function(err, r) {
    if (err) {
      next(err);
    } else {
      res.json(r);
    }
  });
}

function _loadComById(comId, cb) {
  log.silly("Load component: %s", comId);
  Component.findOne({
    id: comId
  }, function(err, r) {
    if (err) {
      cb(err);
    } else {
      if (r) {
        cb(null, r);
      } else {
        cb(new Error("Not found."));
      }
    }
  })
}


function mam_getConfig(req, res, next) {
  var r = {
    params: {
      comId: req.params.comId,
      deviceId: req.device.uuid
    }
  }
  getComDeviceCfg(r, res, next);
}

function mam_runCmd(req, res, next) {
  var com = req.params.comId;
  var func = req.params.cmd;
  var deviceId = req.device.uuid;
  if (!req.body) {
    req.body = {};
  }
  req.body.deviceUuid = deviceId;
  async.waterfall([
    function(scb) {
      if (com && func) {
        runCmd(com, func, req.body, scb);
      } else {
        log.error("Invalid function.", func, com);
        scb(new Error("Command is not valid."));
      }
    }
  ], function(err, r) {
    var args = {
      status: err ? "error" : "completed"
    }
    if (err) {
      log.error(err);
      next(err);
    } else {
      res.json(r);
    }
  });
}

function runCmd(com, funcName, data, cb) {
  try {
    var f = require("../../com/" + com + "/funcs")[funcName];
    if (f && typeof f === "function") {
      f(data, cb);
    } else {
      log.error("Invalid Command. Function not exist or not a function.");
      cb(new Error("Failed to exec function:" + funcName));
    }
  } catch (e) {
    log.error(e);
    cb(new Error("Failed to exe func."));
  }
}
