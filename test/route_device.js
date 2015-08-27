var assert = require("assert");
var fn = require("../routes/funcs/device");
var models = require("../models");
var helper = require("./helper");
models.init();
describe("device route", function() {
  before(function(done) {
    models.cleanDb(done);
  });
  after(function(done) {
    // models.cleanDb(done);
    done();
  });
  it ("should list all devices",function(done){
    var d=new models.Device({
      uuid:"test1"
    });
    d.save(function(e){
        assert(!e);
        fn.listDevice(null,helper.res(function(r){
          assert(r.length===1);
          assert(r[0].uuid === "test1");
          done();
        }))
    })
  });
});
