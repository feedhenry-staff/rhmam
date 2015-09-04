app.factory("mock", function($timeout) {
  var exports = {};
  //turn this to true to use mock
  exports.isMock = false;
  exports.delay = 300;
  exports.call = function(param) {
    var url = param.url;
    var func = funcs[url];
    $timeout(function() {
      try{
        func(param);
      }catch(e){
        throw(url+" "+e.toString());
      }
    }, exports.delay);
  }

  var funcs = {
    "/api/com": funcWrap(listComs),
    "/api/com/log": funcWrap(loadComLog),
    "/api/com/log/device/ef83ab32d5e8762bc9275/cfg": funcWrap(loadDeviceConfig),
    "/api/device": funcWrap(listDevice),
    "/api/com/log/run/logs": funcWrap(listLogs),
    "/api/task":funcWrap(task1)
  }
  var dummyTasks=[{
    deviceUuid:"ef83ab32d5e8762bc9275",
    status:"new",
    createDate:new Date(),
    task:"log.requestLog"
  },{
    deviceUuid:"ef83ab32d5e8762bc9275",
    status:"new",
    createDate:new Date(),
    task:"device.updateConfig"
  }];
  function task1(data,cb){
    if (data.deviceUuid){
      dummyTasks.push(data);
      cb();
    }else{
      cb(null,dummyTasks);
    }
  }

  function loadDeviceConfig(data, cb) {
    cb(null,{
      record:true,
      uploadInterval:20,
      logRotation: 3,
      encrypt:false
    });
  }

  function listLogs(data, cb) {
    cb(null, [{
      "_id": 1,
      "data": "2015-01-01 INFO this is a log test"
    }])
  }

  function listDevice(data, cb) {
    cb(null, [{
      "_id": "123",
      "uuid": "ef83ab32d5e8762bc9275",
      "lastOnline": new Date()
    }])
  }

  function loadComLog(data, cb) {
    cb(null, {
      id: "log",
      name: "Log",
      config: {
        record: true,
        uploadInterval: 60,
        logRotation: 5,
        encrypt: false
      },
      ui: {
        "config": true,
        "device": true
      }
    })
  }

  function listComs(data, cb) {
    cb(null, [{
      "name": "Log",
      "id": "log"
    }, {
      "name": "Log",
      "id": "log"
    }, {
      "name": "Log",
      "id": "log"
    }, {
      "name": "Log",
      "id": "log"
    }]);
  }

  function funcWrap(func) {
    return function(param) {
      var data = param.data;
      func(data, function(err, r) {
        if (err) {
          param.error(err);
        } else {
          param.success(r);
        }
      });
    }
  }
  return exports;
});
