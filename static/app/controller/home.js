app.controller("home",function($scope,server,$state){
  $scope.coms=[];
  function init(){
    server.listComs().then(function(d){
      $scope.coms=d;
    });
  }
  init();
});
