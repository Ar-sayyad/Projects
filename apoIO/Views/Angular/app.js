    var baseServiceUrl = "https://192.168.1.28:1706/piwebapi/";
    var user = "Asif";
    var pass = "ECG@123";
    var afServerName = "ECG-DEV-SERVER";
    var afDatabaseName = "Aasif_Development";
   // var efTemplateName = "StreetView_EFTemplate";

var app = angular.module("myApp", ["ngRoute"]);
    app.config(function($routeProvider) {
    $routeProvider   
    .when("/Home", {
        controller: 'summaryController',
        templateUrl : "Views/default.html"
    })
    .when("/Master", {        
        controller : "masterController",
        templateUrl : "Views/master_dashboard.html"
    })
    .when("/Chart", {        
        controller : "chartController",
        templateUrl : "Views/chart.html"
    })
    .otherwise({ redirectTo: '/Home' });
});

var processJsonContent = function (url, type, data) {
           return $.ajax({
            url: encodeURI(url),
            type: type,
            data: data,
            contentType: "application/json; charset=UTF-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization",  makeBasicAuth(user, pass));
            }
        });
    };
    var makeBasicAuth = function (user, password) {
        var tok = user + ':' + password;
        var hash = window.btoa(tok);
        return "Basic " + hash;
    };