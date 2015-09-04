app.controller("com",function($scope,$stateParams,angularLoad,Component,$state,device,$timeout){
  $scope.comName=$stateParams.name;
  $scope.comId=$stateParams.id;
  $scope.pageTitle="default configuration";
  $scope.com=new Component($scope.comId);
  $scope.conf=$scope.com.getConfig();
  $scope.devices=[];
  $scope.refreshDeviceList=refreshDevice;
  $scope.toReadableTime=toReadableTime;
  $scope.$on("$stateChangeSuccess",function(){
    $scope.page=pages[$state.current.name];
  });
  $scope.flush=function(){
    $timeout(function(){
      $scope.$apply();
    },0);
  }
  $scope.getConfigUrl=function(){
    return "com/"+$stateParams.id+"/config.html";
  }
  $scope.getUrl=function(name){
    return "com/"+$stateParams.id+"/"+name+".html";
  }

  var pages={
    "com":{
      "title":"Configuration",
      "isConfig":true
    },
    "com.devices":{
      "title":"Devices",
      "isDevice":true
    }
  }
  $scope.page=pages[$state.current.name];
  function toReadableTime(dt){
    var d=new Date(dt);
    var now=new Date();
    var span=Math.floor((now.getTime()-d.getTime())/1000);
    if (span<300){
      return span+" sec";
    }else if (span<6000){
      return Math.floor(span/60)+ " min";
    }else if (span<3600*8){
      return Math.floor(span/3600)+" hour";
    }else {
      return Math.floor(span/3600/24)+ " day";
    }
  }
  function refreshDevice(){
      return device.list().then(function(dlist){
          $scope.devices=dlist;
      });
  }
  function initCom(){

    // angularLoad.loadScript("com/"+$scope.comId+"/controller.js")
    // .then(angularLoad.loadScript.bind(angularLoad,"com/"+$scope.comId+"/factory.js"))
    $scope.com.load()
    .then(function(c){
      $scope.com=c;
      $scope.conf=$scope.com.getConfig();
    })
    .then(refreshDevice())
    .catch(function(err){

    });
  }
  initCom();
});

app.controller("com.device",function($scope,Component,$stateParams){
  var comId=$stateParams.id;
  var deviceId=$stateParams.deviceId;
  $scope.conf={};
  $scope.saveConfig=saveConfig;
  $scope.addTask=addTask;
  init();

  function addTask(task){
      $scope.com.addTask(task,deviceId);
  }
  function saveConfig(){
    $scope.com.updateConfigForDevice(deviceId,$scope.conf)
    .then(function(){
      alert("Configuration saved successfully.");
    })
    .catch(function(err){
      alert(err);
    });
  }
  function init(){
    $scope.com.getConfigForDevide(deviceId)
      .then(function(d){
        $scope.conf=d;
      })
      .catch(function(){

      });
  }
});
