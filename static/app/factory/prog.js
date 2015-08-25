app.factory("prog",function(){
  var exports={};
  exports.start=NProgress.start.bind(NProgress);
  exports.inc=NProgress.inc.bind(NProgress);
  exports.done=NProgress.done.bind(NProgress);
  exports.set=NProgress.set.bind(NProgress);
  return exports;
});
