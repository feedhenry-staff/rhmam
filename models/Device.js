var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Device = new Schema({
  uuid: String,
  lastOnline: Date,
  /*
  device.model
  device.cordova
  device.platform
  device.uuid
  device.version
  device.name
  http://docs.phonegap.com/en/edge/cordova_device_device.md.htm
  */
  device: Schema.Types.Mixed,
  /*
  {
    "cuid": "F8E5EFED56AA4B0C883FF72426025B67",
    "cuidMap": null,
    "destination": "studio&url=https://zurich-sgs2n4dimjktimjv6si4lwdq-dev.df.dev.e111.feedhenry.net",
    "sdk_version": "FH_JS_SDK/2.5.0-155",
    "appid": "000000000000000000000000",
    "appkey": "0000000000000000000000000000000000000000",
    "projectid": "000000000000000000000000",
    "connectiontag": "0.0.1"
  }*/
  fhParams: Schema.Types.Mixed,
  registeredDate: Date,
  /**
    Device specified config. e.g.
    {
    "log":{"record":true},
    "device":{"liveInterval":20}
  }
  */
  config: {
    type: Schema.Types.Mixed,
    default: {}
  },
  customFields: Schema.Types.Mixed
});

var Model = mongoose.model("Device", Device);
module.exports = Model;
