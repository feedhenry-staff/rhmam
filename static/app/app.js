var app=angular.module("fhmam",["ui.router","ui.bootstrap"]);
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
});

app.run(function(){

});
