var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var log = require("../log");
var async = require("async");
var Component = new Schema({
  id: String, // the code friendly name of the component. e.g. "log"
  name: String, // user friendly name of the component. e.g. "Log"
  config: Schema.Types.Mixed, //default configuration
  ui: { // ui related switches
    config: Schema.Types.Mixed,
    "device": Schema.Types.Mixed,
    "global": Schema.Types.Mixed
  },
  tasks: Schema.Types.Mixed,
  props: Schema.Types.Mixed
});
Component.statics.install = function(cb) {
  var components = require("./components.js");
  log.info("Start to install components. Length: ", components.length);
  async.series([
    function(scb) {
      Model.find({}, function(err, r) {
        if (err) {
          scb(err);
        } else {
          log.info("Use saved configuration.");
          r.forEach(function(item) {
            components.forEach(function(newItem) {
              if (newItem.id === item.id) {
                for (var key in item.config) {
                  if (typeof newItem.config[key] !="undefined"){
                    newItem.config[key] = item.config[key];
                  }
                }
              }
            });
          });
          scb();
        }
      });
    },
    function(scb) {
      Model.remove({}, scb);
    },
    function(scb) {
      Model.create(components, scb);

    }
  ], cb);
}
var Model = mongoose.model("Component", Component);

module.exports = Model;
