module.exports = {
  listDevice: listDevice
};

var Device = require("../../models").Device;

function listDevice(req, res, next) {
  Device.find({}, function(err, r) {
    if (err) {
      next(err);
    } else {
      res.json(r);
    }
  });
}
