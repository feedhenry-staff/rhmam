module.exports = {
  listComs: listComs,
  getCom: getCom,
  updateComConfig: updateComConfig,
  getComDeviceCfg: getComDeviceCfg
};

var Component = require("../../models").Component;
var async = require("async");
var Device = require("../../models").Device;
var log=require("../../log");

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
      log.info("Load device config for %s of component %s",deviceId,comId,d.config);
      if (d.config[comId]) {
        log.silly("custom config found for %s of component %s",deviceId,comId);
        scb(null, d.config[comId]);
      } else {
        log.silly("custom config not found for %s of component %s",deviceId,comId);
        //load default config
        _loadComById(comId, function(err, r) {
          if (err) {
            scb(err);
          } else {
            scb(null,r.config);
          }
        });
      }
    }
  ], function(err, cfg) {
    if (err) {
      next(err);
    } else {
      log.silly("cfg found for %s of component %s",deviceId,comId,cfg);
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
  Component.find({}, function(err, r) {
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
  log.silly("Load component: %s",comId);
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
