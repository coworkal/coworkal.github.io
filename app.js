'use strict';

var flyerApp = angular.module('flyerApp', [
    'ngRoute',
    'facebook',
    'services.eventquery',
    'flyerApp.flyer',
    'flyerApp.flyer-list',
    'flyerApp.lint',
    'flyerApp.schedule']).

config([
    'FacebookProvider',
    function(FacebookProvider) {
        var myAppId = '588036218022182';
        FacebookProvider.init(myAppId);
    }
]).

config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/flyer'
        });
}]).

run(['$rootScope', '$http',
function($rootScope, $http) {

    $rootScope.coworking_nights = [];
    $rootScope.coworking_venues = [];

    $http.get('events.json').success(function(data) {
        for(var i = 0; i < data.events.length; i++) {
            data.events[i].date = new Date(data.events[i].date);
        }
        $rootScope.coworking_nights = data.events;
        $rootScope.coworking_venues = data.venues;
    });
}]);

