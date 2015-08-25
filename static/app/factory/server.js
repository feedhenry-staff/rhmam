app.factory("server", function(mock, $q,prog) {
  var exports = {
    listComs:listComs,
    loadCom:loadCom
  };
  function listComs(){
    return _call({
      url:"/api/com"
    });
  }
  function loadCom(id){
    return _call({
      url:"/api/com/"+id
    })
  }

  function _call(param) {
    prog.start();
    var defer = $q.defer();
    var def = {
      "url": "",
      "method": "GET",
      "data": {},
      "success":function(d){
        prog.done();
        defer.resolve(d);
      },
      "error":function(err){
        prog.done();
        defer.reject(err);
      }
    }
    for (var key in param){
      def[key]=param[key];
    }
    if (mock.isMock){
      mock.call(def);
    }else{
      $.ajax(def);
    }

    return defer.promise;
  }
  return exports;
});
