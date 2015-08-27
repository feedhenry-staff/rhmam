var app=angular.module("fhmam",["ui.router","ui.bootstrap","angularLoad"]);
app.config(function($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise("/home");
  $stateProvider.state("home",{
    url:"/home",
    templateUrl:"./tmpl/home.html"
  });
  $stateProvider.state("com",{
    url:"/com?id&name",
    templateUrl:"./tmpl/com.html"
  });
  $stateProvider.state("com.devices",{
    url:"/devices",
    templateUrl:"./tmpl/com_devices.html"
  });
  $stateProvider.state("com.device",{
    url:"/device?deviceId",
    templateUrl:"./tmpl/com_device.html"
    // templateUrl:function($stateParams){
    //   return "com/"+$stateParams.id+"/device.html";
    // }
  });
});

app.run(function(){

});
