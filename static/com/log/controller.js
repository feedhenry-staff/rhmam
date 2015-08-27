app.controller("log",function($scope,server,$stateParams){
  $scope.logs=[];
  function init(){
    server.call({
      url:"/api/com/log/logs",
      data:$stateParams
    })
    .then(function(l){
      $scope.logs=l;
    })
    .catch(function(err){

    })
  }
  init();
});
