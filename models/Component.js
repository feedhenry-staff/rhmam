var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var log=require("../log");
var async=require("async");
var Component=new Schema({
  id:String, // the code friendly name of the component. e.g. "log"
  name:String, // user friendly name of the component. e.g. "Log"
  config:Schema.Types.Mixed, //default configuration
  ui:{ // ui related switches
    config:Schema.Types.Mixed,
    "device":Schema.Types.Mixed,
    "global":Schema.Types.Mixed
  }
});
Component.statics.install=function(cb){
  log.info("Start to install components. Length: ",components.length);
  async.eachSeries(components,function(com,scb){
    var id=com.id;
    Model.findOne({"id":id},function(err,d){
      if (err){
        scb(err);
      }else{
        if (d){
          log.info("Found component in db: %s, start to merge. ",com.name);
          d.name=com.name;
          for (var key in com.config){
            if (typeof d.config[key] === "undefined"){
              d.config[key]=com.config[key];
            }
          }
          d.save(scb);
        }else{
          log.info("Component not found: %s, install now.", com.name);
          com.save(scb);
        }
      }
    });
  },function(err){
    if (err){
      log.error("Component installation failed.");
      cb(err);
    }else{
      log.info("Components installed successfully.");
      cb(null);
    }
  });
}
var Model=mongoose.model("Component",Component);
var components=[
  new Model({
    id:"log",
    name:"Log",
    config:{
      record:true,
      uploadInterval:60,
      logRotation: 5,
      encrypt:false
    },
    ui:{
      config:{},
      device:{}
    }
  }),
  new Model({
    id:"device",
    name:"Device",
    config:{
      liveInterval: 0
    },
    ui:{
      config:{},
      device:{}
    }
  }),
]

module.exports=Model;
