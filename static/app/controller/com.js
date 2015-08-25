app.controller("com",function($scope,$stateParams,server){
  $scope.comName=$stateParams.name;
  $scope.comId=$stateParams.id;
  $scope.pageTitle="default configuration";
  $scope.com={};
  $scope.getConfigUrl=function(){
    return "com/"+$stateParams.id+"/config.html";
  }

  function initCom(){
    server.loadCom($scope.comId)
    .then(function(c){
      $scope.com=c;
    })
    .catch(function(){

    });
  }
  initCom();
});
