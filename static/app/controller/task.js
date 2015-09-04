app.controller("task",function($scope,task){
  $scope.tasks=[];
  $scope.refresh=refresh;
  $scope.showMsg=showMsg;
  refresh();
  function refresh(){
    task.list()
      .then(function(l){
        $scope.tasks=l;
      })
      .catch(function(){

      });
  }
  function showMsg(msg){
    alert(msg);
  }
});
