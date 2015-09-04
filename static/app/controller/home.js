app.controller("home",function($scope,Component,$state){
  $scope.coms=[];
  function init(){
    Component.list().then(function(d){
      $scope.coms=d;
    });
  }
  init();
});
