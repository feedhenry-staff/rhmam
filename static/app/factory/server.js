app.factory("server", function(mock, $q,prog) {
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
  return _call;
});
