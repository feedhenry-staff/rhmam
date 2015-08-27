var mongoose=require("mongoose");
var env=require("../env");
var models={
  "Component":require("./Component"),
  "Device":require("./Device"),
  "Task":require("./Task")
}
var inited=false;
function init(cb){
  if (inited===false){
    inited=true;
    var connStr=env.get("FH_MONGODB_CONN_URL");
    mongoose.connect(connStr,cb);
  }
}
function cleanAll(cb){
  var async=require("async");
  async.each(models,function(m,scb){
    m.remove({},scb);
  },cb);
}
for (var key in models){
  exports[key]=models[key];
}
exports.init=init;
exports.cleanDb=cleanAll;
