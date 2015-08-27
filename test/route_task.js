var assert = require("assert");
var fn = require("../routes/funcs/task");
var models = require("../models");
var helper = require("./helper");
var res=helper.res;
models.init();
describe("task route", function() {
  before(function(done) {
    models.cleanDb(done);
  });
  it ("should create / list / delete tasks",function(done){
    var req={
      body:{
          "deviceUuid":"2234",
          "task":"hello.ping"
      }
    }
    fn.newTask(req,res(function(){
      fn.listTask(null,res(function(r){
        assert(r.length===1);
        assert(r[0].deviceUuid==="2234");
        assert(r[0].task==="hello.ping");
        assert(r[0].status==="new");
        fn.deleteTask({
          params:{
            taskId:r[0]._id
          }
        },res(function(){
          fn.listTask(null,res(function(r){
            assert(r.length===1);
            assert(r[0].status==="deleted");
            done();
          }))
        }))
      }))
    }))
  });
});
