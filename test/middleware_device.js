var assert=require("assert");
var mw=require("../routes/middleware/deviceRegister");
var models=require("../models");
models.init();
var Device=models.Device;
describe("Device Register middleware",function(){
  after(function(done){
    models.cleanDb(done);
  });
  it("should register device through header",function(done){
    var h={
      "X-MAM-DEVICE":JSON.stringify({
        "device":{
          "uuid":"12345",
          "name":"some device"
        },
        "fh":{
          "connectionTag":"0.1.1"
        }
      })
    };
    var req={
      get:function(key){
        return h[key];
      }
    }
    mw(req,{},function(){
      setTimeout(function(){// as its running asyncly, we cannot get accurate success point.
        Device.findOne({
          uuid:"12345"
        },function(err,d){
          assert(!err);
          assert(req.device);
          assert(req.device.uuid==="12345");
          assert(req.device.name==="some device");
          assert(d.device.name==="some device");
          assert(d.uuid);
          assert(d.registeredDate);
          assert(d.lastOnline);
          assert(d.config);
          done();
        })
      },1000);
    });

  });
});
