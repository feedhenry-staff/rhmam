var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var Log=new Schema({
  deviceUuid:String,
  text:String,
  meta:Schema.Types.Mixed,
  timestamp:Number
});

var Model=mongoose.model("Log",Log);
module.exports=Model;
