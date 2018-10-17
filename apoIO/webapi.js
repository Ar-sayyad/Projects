var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
       templateUrl: 'main.html',
    })
    .when("/Master", {
        templateUrl : "main.html"
    })
    .when("/Master", {
         controller: 'masterController',
        templateUrl: '/Views/master_dashboard.html',
    })
    .when("/piwebapi", {
        templateUrl : "piwebapi_call.html"
    });
   // .otherwise({ redirectTo: '/Home' });
});
