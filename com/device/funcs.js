module.exports = {
  getCustomFields: getCustomFields,
  setCustomFields: setCustomFields
}
var Device = require("../../models").Device;

function getCustomFields(data, cb) {
  var d = data.deviceUuid;
  if (d) {
    Device.findOne({
      uuid: d
    }, function(err, res) {
      if (err) {
        cb(err);
      } else {
        if (res) {
          // console.log(typeof res.customFields);
          cb(null, res.customFields);
        } else {
          cb(null, []);
        }
      }
    });
  } else {
    cb(new Error("deviceUuid should be provided. but got:" + d));
  }
}

function setCustomFields(data, cb) {
  var d = data.deviceUuid;
  if (d) {
    Device.findOneAndUpdate({
      uuid: d
    }, {
      customFields: JSON.parse(data.fields)
    }, function(err) {
      if (err) {
        cb(err);
      } else {
        cb();
      }
    });
  } else {
    cb(new Error("deviceUuid should be provided. but got:" + d));
  }
}
