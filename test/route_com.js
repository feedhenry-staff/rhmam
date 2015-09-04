var assert = require("assert");
var fn = require("../routes/funcs/com");
var models = require("../models");
var helper = require("./helper");
models.init();
describe("Com route", function() {
  before(function(done) {
    models.cleanDb(done);
  });
  after(function(done) {
    // models.cleanDb(done);
    done();
  });
  it("should list all components", function(done) {
    var c = new models.Component({
      id: "hello",
      name: "test component"
    });
    c.save(function(err) {
      assert(!err);
      fn.listComs(null, helper.res(function(d) {
        assert(d.length === 1);
        assert(d[0].id === "hello");
        assert(d[0].name === "test component");
        done();
      }), function(err) {
        assert(!err);
        done();
      })
    })
  });

  it("should get a component", function(done) {
    var req = {
      "params": {
        comId: "hello"
      }
    }
    fn.getCom(req, helper.res(function(d) {
      assert(d.id === "hello");
      assert(d.name === "test component");
      done();
    }), function(err) {
      assert(!err);
      done();
    })
  });

  it("should update component default config", function(done) {
    var req = {
      params: {
        comId: "hello"
      },
      body: {
        "test": "config"
      }
    }
    fn.updateComConfig(req, helper.res(function() {
      fn.getCom(req, helper.res(function(d) {
        assert(d.id === "hello");
        assert(d.name === "test component");
        assert(d.config);
        assert(d.config.test === "config");
        done();
      }))
    }))
  });

  it("should get config for a specific device", function(done) {
    var d = new models.Device({
      "uuid": "testUuid"
    });
    d.save(function(e) {
      assert(!e);
      var req = {
        params: {
          comId: "hello",
          deviceId: "testUuid"
        }
      }
      fn.getComDeviceCfg(req, helper.res(function(r) {
        assert(r.test === "config");
        models.Device.update({
          uuid: "testUuid"
        }, {
          config: {
            "hello": {
              test: "configDevice"
            }
          }
        }, function(e) {
          assert(!e);
          req.device = {
            uuid: "testUuid"
          }
          fn.mam_getConfig(req, helper.res(function(r) {
            assert(r.test === "configDevice");
            done();
          }));
        });
      }))
    })

  });
  it("should run command for a component", function(done) {
    var Log = models.Log;
    var l = new Log({
      deviceUuid: "testuuid",
      text: "hello log"
    });
    l.save(function() {
      fn.runCmd({
        params: {
          "comId": "log",
          "cmd": "logs"
        },
        body:{
          "deviceUuid":"testuuid"
        }
      }, helper.res(function(d) {
        assert(d.length>0);
        assert(d[0].text==="hello log");
        done();
      }));
    })
  });
});
