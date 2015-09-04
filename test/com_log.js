var assert = require("assert");
var fn = require("../com/log/funcs");
var models = require("../models");
models.init();
describe("Log Component", function() {
  before(function(done) {
    models.cleanDb(done);
  });
  after(function(done) {
    // models.cleanDb(done);
    done();
  });
  it("should list logs for a device", function(done) {
    var Log = models.Log;
    var l = new Log({
      deviceUuid: "testuuid",
      text: "hello log",
      timestamp:1
    });
    l.save(function() {
      fn.logs({
        "deviceUuid": "testuuid"
      }, function(err,d) {
        assert(!err);
        assert(d.length > 0);
        assert(d[0].text === "hello log");
        done();
      });
    });
  });
  it("should get timestamp of last log", function(done) {
    var Log = models.Log;
    var l = new Log({
      deviceUuid: "testuuid",
      text: "hello log",
      timestamp:2
    });
    l.save(function() {
      fn.getTimestamp({
        "deviceUuid": "testuuid"
      }, function(err,d) {
        assert(!err);
        assert(d.timestamp === 2);
        done();
      });
    });
  });

  it ("should upload log",function(done){
      var data={
        deviceUuid:"test1",
        logs:JSON.stringify([{
          deviceUuid:"djdd",
          text:"111",
          timestamp:1
        },{
          deviceUuid:"test2",
          text:"222",
          timestamp:2
        }])
      }
      fn.uploadLog(data,function(err,r){
        assert(!err);
        done();
      });
  });

});
