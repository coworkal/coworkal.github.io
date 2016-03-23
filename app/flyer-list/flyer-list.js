angular.module('flyerApp.flyer-list', ['ngRoute', 'services.eventquery'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/flyer',  {
        templateUrl: 'flyer-list/flyer-list.html',
        controller: 'FlyerListCtrl'
    });
}])

.controller('FlyerListCtrl', ['$scope', '$rootScope', '$routeParams',

function ($scope, $rootScope, $routeparams) {
    $scope.events = [];
    $scope.upcoming = [];
    $scope.past = [];
    $scope.next_event = {};

    while($rootScope.coworking_nights.length === 0) {
        console.log("Waiting for events");
    }

    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    for (var i = 0; i < $rootScope.coworking_nights.length; i++) {
        var event_date = $rootScope.coworking_nights[i].date;

        if (event_date >= today)
        {
            $scope.upcoming.push($rootScope.coworking_nights[i]);
        }
        else
        {
            $scope.past.push($rootScope.coworking_nights[i]);
        }
    }
    $scope.next_event = $scope.upcoming[0];
    $scope.upcoming.shift();
}]);