app.factory("device", function(server, $q) {
  var exports = {};
  exports.list = list;

  function list() {
    return server({
        url: "/api/device"
      });
  }
  return exports;
});
