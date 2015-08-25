app.factory("mock",function($timeout){
  var exports={};
  //turn this to true to use mock
  exports.isMock=true;
  exports.delay=300;
  exports.call=function(param){
    var url=param.url;
    var func=funcs[url];
    $timeout(function(){
      func(param);
    },exports.delay);
  }

  var funcs={
    "/api/com":funcWrap(listComs),
    "/api/com/log":funcWrap(loadComLog)
  }
  function loadComLog(data,cb){
    cb(null,{
      id:"log",
      name:"Log",
      config:{
        "enabled":false
      }
    })
  }
  function listComs(data,cb){
    cb(null,[{
      "name":"Log",
      "id":"log"
    },{
      "name":"Log",
      "id":"log"
    },{
      "name":"Log",
      "id":"log"
    },{
      "name":"Log",
      "id":"log"
    }]);
  }

  function funcWrap(func){
    return function(param){
      var data=param.data;
      func(data,function(err,r){
        if (err){
          param.error(err);
        }else{
          param.success(r);
        }
      });
    }
  }
  return exports;
});
