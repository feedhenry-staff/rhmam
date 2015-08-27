var log = require("../../log");
var async=require("async");
var Device=require("../../models").Device;
var q=async.queue(onDevice,1);
/*
{
  "fh":{},  //from $fh.getFHParams
  "device":{} //from cordova.device
}
*/
module.exports = function(req, res, next) {
  var deviceInfo = req.get("X-MAM-DEVICE");
  if (deviceInfo) {
    try {
      var d = JSON.parse(deviceInfo);
      if (d.device) {
        var uuid = d.device.uuid;
        if (uuid) {
          log.silly("Received device with uuid:",uuid);
          q.push(d);
        }
      }
    } catch (e) {
      log.error("Failed to parse device info:", deviceInfo);
      log.error(e);
    }
  }
  //run next asyncly
  next();
}

function onDevice(task,cb){
  log.silly("device task",task);
  var uuid=task.device.uuid;
  Device.findOne({uuid:uuid},function(err,s){
    if (err){
      log.error("Failed to retrieve device from db. uuid: ",uuid);
      cb();
    }else{
      if (s){
        log.silly("Device found for uuid: %s, start to merge",uuid);
      }else{
        log.silly("Device not found. Register new device for: ",uuid);
        s=new Device();
      }
      mapDevice(task,s);
      log.silly("Store device");
      s.save(cb);
    }
  });
}
function mapDevice(income,d){
  if (d.isNew){
    d.uuid=income.device.uuid;
    d.registeredDate=new Date();
  }
  d.lastOnline=new Date();
  d.device=income.device;
  d.fhParams=income.fh;
}
