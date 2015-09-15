app.controller("mam-storage",function($scope){
  $scope.fullPath="";
  $scope.directories=[];
  $scope.dir={};
  $scope.syncFile=syncFile;
  $scope.downloadFile=downloadFile;
  $scope.refresh=refresh;
  $scope.syncFileEntry=function(fPath){
    $scope.addTask("syncFile",{"fullPath":fPath?fPath:$scope.fullPath});
  }
  refresh();
  function refresh(){
    $scope.com.run("listDirectories",{
      deviceUuid:$scope.getDeviceId()
    })
    .then(function(l){
      $scope.directories=l;
    })
    .catch(function(err){

    });
  }
  function syncFile(entry){
    $scope.syncFileEntry(entry.fullPath);
  }
  function downloadFile(entry){
    var deviceId=$scope.getDeviceId();
    var fullPath=entry.fullPath;
    $scope.com.run("fileExists",{
      deviceUuid:deviceId,
      fullPath:fullPath
    })
    .then(function(res){
      if (res.exists){
        var iframe=document.createElement("iframe");
        var url="/api/download?deviceId="+deviceId+"&fullPath="+fullPath;
        iframe.src=url;
        iframe.style="display:none";
        document.querySelector("body").appendChild(iframe);
      }else{
        var select=confirm("File not found. It may be removed or not ever uploaded. Do you want to upload it now?");
        if (select){
          $scope.syncFileEntry(fullPath);
        }else{

        }
      }
    })
    .catch(function(err){

    });
  }
});
