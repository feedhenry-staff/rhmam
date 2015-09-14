app.controller("mam-device", function($scope, $stateParams) {
  $scope.fields = [];
  $scope.addField = addField;
  $scope.removeField = removeField;
  $scope.saveFields = saveFields;
  var deviceUuid = $stateParams.deviceId;
  init();

  function init() {
    $scope.com.run("getCustomFields", {
        deviceUuid: deviceUuid
      })
      .then(function(l) {
        if (l && l instanceof Array){
          $scope.fields = l;
        }
      })
      .catch(function(err) {

      });
  }

  function addField() {
    $scope.fields.push({
      "name": "",
      "value": ""
    });
  }

  function removeField(index) {
    $scope.fields.splice(index, 1);
  }

  function saveFields() {
    $scope.com.run("setCustomFields", {
      deviceUuid: deviceUuid,
      fields: angular.toJson($scope.fields)
    });
  }
});
