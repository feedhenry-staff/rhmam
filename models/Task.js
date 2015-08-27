var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var Task=new Schema({
  "deviceUuid":String,
  "status":{type:String,default:"new"}, // new -> dispatched -> completed / error  | any -> deleted
  "createDate":{type:Date, default:Date.now},
  "dispatchDate":Date,
  "completeDate":Date,
  "task":String,
  "reply":{
    "isSuccess":Boolean,
    "data":Schema.Types.Mixed
  }
});

var Model=mongoose.model("Task",Task);
module.exports=Model;
