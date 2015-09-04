app.factory("task", function(server) {
  var exports = {
    add: add,
    list:list
  };

  function add(obj) {
    return server({
      url: "/api/task",
      method: "POST",
      data: obj
    });
  }

  function list(){
    return server({
      url:"/api/task"
    });
  }
  return exports;
});
