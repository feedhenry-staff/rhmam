var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var DirEntry=new Schema({
  deviceUuid:String,
  directory:String,
  content:Schema.Types.Mixed
});

var Model=mongoose.model("DirEntry",DirEntry);
module.exports=Model;
