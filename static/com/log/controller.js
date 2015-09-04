app.controller("log", function($scope, $interval, server, $stateParams) {
  $scope.logs = [];
  $scope.toDate = toDate;
  $scope.poll = poll;
  $scope.format="dd-MM-yyyy"
  $scope.stdt=new Date();
  $scope.endt=new Date();
  $scope.status={};
  $scope.refresh=refreshLogs;
  $scope.open = function($event) {
    $scope.status.opened = true;
  };
  $scope.$on("$destroy",function(){
    stopPoll();
  })
  /**
  Tasks for Log component
  requestLog
  */
  var deviceId = $stateParams.deviceId;
  init();
  var isPoll = false;
  var pollTimer = null;

  function poll(v) {
    if (typeof v != "undefined") {
      isPoll = v;
      if (isPoll) {
        startPoll();
      } else {
        stopPoll();
      }
    }
    return isPoll;
  }

  function startPoll() {
    stopPoll();
    pollTimer = $interval(function() {
      refreshLogs();
    }, 2000);
  }
  function trimDate(dt){
    return new Date(dt.getFullYear(),dt.getMonth(),dt.getDate());
  }
  function stopPoll() {
    if (pollTimer) {
      $interval.cancel(pollTimer);
    }
    pollTimer = null;
  }

  function refreshLogs() {
    var stT=$scope.stdt?trimDate($scope.stdt).getTime():null;
    var etT=$scope.endt?trimDate($scope.endt).getTime()+3600*1000*24:null;
    $scope.com.run("logs", {
        deviceUuid: deviceId,
        start:stT,
        end:etT
      })
      .then(function(d) {
        $scope.logs = d;
      })
      .catch(function() {

      });
  }

  function init() {
    refreshLogs();
  }

  function toDate(timestamp) {
    var d = new Date(timestamp);
    return d.toISOString();
  }
});
