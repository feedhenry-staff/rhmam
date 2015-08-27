app.controller("com",function($scope,$stateParams,angularLoad,server,$state){
  $scope.comName=$stateParams.name;
  $scope.comId=$stateParams.id;
  $scope.pageTitle="default configuration";
  $scope.com={};
  $scope.devices=[];
  $scope.$on("$stateChangeSuccess",function(){
    $scope.page=pages[$state.current.name];
  });
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
  function initCom(){
    // angularLoad.loadScript("com/"+$scope.comId+"/controller.js")
    // .then(angularLoad.loadScript.bind(angularLoad,"com/"+$scope.comId+"/factory.js"))
    server.loadCom($scope.comId)
    .then(function(c){
      $scope.com=c;
    })
    .then(server.listDevices)
    .then(function(dlist){
      $scope.devices=dlist;
    })
    .catch(function(err){

    });
  }
  initCom();
});

app.controller("com.device",function($scope){
  $scope.com={};
});
