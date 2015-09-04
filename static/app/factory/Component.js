app.factory("Component", function(server,task, $q) {
  function Com(comId, p) {
    if (!comId) {
      throw ("ComId cannot be empty");
    }
    this.props = {};
    this.comId = comId;
    if (p) {
      this.props = p;
    }
  }
  Com.prototype.addTask=function(name,deviceId){
    var obj={
      deviceUuid:deviceId,
      task:this.comId+"."+name
    }
    return task.add(obj);
  }
  Com.prototype.load = function() {
    var defer = $q.defer();
    var self = this;
    server({
        url: "/api/com/" + this.comId
      }).then(function( r) {
        self.props = r;
        defer.resolve(self);
      })
      .catch(defer.reject);
    return defer.promise;
  }
  Com.prototype.run=function(name,data){
    var url="/api/com/"+this.comId+"/run/"+name;
    return server({
      url:url,
      method:"POST",
      data:data
    });
  }
  Com.prototype.updateConfigForDevice=function(deviceId,cfg){
    var defer=$q.defer();
    var self=this;
    server({
      url:"/api/com/"+this.comId+"/device/"+deviceId+"/cfg",
      method:"POST",
      data:cfg
    })
    .then(this.addTask("updateConfig",deviceId))
    .then(defer.resolve)
    .catch(defer.reject);
    return defer.promise;
  }
  Com.prototype.getConfigForDevide=function(deviceId){
    return server({
      url:"/api/com/"+this.comId+"/device/"+deviceId+"/cfg"
    });
  }
  Com.prototype.getConfig=function(){
    return this.props.config;
  }
  Com.list = function() {
    var defer = $q.defer();
    server({
        url: "/api/com"
      })
      .then(function(r) {
        var rtn = [];
        if (r && r.length > 0) {
          for (var i = 0; i < r.length; i++) {
            rtn.push(new Com(r[i].id, r[i]));
          }
        }
        defer.resolve(rtn);
      })
      .catch(defer.reject);
    return defer.promise;
  }
  return Com;
});
