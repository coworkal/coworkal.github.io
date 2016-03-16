'use strict';

angular.module('flyerApp.flyer', ['ngRoute', 'services.eventquery'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/flyer/:id',  {
        templateUrl: 'flyer/flyer.html',
        controller: 'FlyerCtrl'
    });
}])

.controller('FlyerCtrl', [ '$scope', '$rootScope', '$routeParams', '$filter', 'eventquery',

function ($scope, $rootScope, $routeParams, $filter, eventquery) {
    $scope.draw = false;

    var color = 0;
    if($routeParams.color) {
        color = $routeParams.color % 6;
    } else {
        color = $routeParams.id % 6;
    }

    $scope.bgprimary = 'bg-primary-' + color;
    $scope.bgsecondary = 'bg-secondary-' + color;
    $scope.fillprimary = 'fill-primary-' + color;
    $scope.fillsecondary= 'fill-secondary-' + color;
    $scope.textprimary = 'text-primary-' + color;
    $scope.textsecondary = 'text-secondary-' + color;

    eventquery.dataReadyCb = function() {
        $scope.events = eventquery.events;
        $scope.night_id = $routeParams.id;
        $scope.date = eventquery.getCoworkingDate($scope.night_id);
        $scope.draw_events();
        $scope.draw = true;
    }

    $scope.$watch(
        function () {
            return eventquery.isSdkReady();
        },
        function(newVal) {
            eventquery.init_user(newVal);
        }
    );

    $scope.IntentLogin = function() {
        if(!eventquery.isUserConnected()) {
            eventquery.login();
        }
    };

    $scope.draw_events = function() {
        var df = new Date($scope.date);
        df.setDate(df.getDate() - 1);
        var dt = new Date($scope.date);
        dt.setDate(dt.getDate() + 1);

        var result = [];

        for (var i = 0; i < $scope.events.length ; i++) {
            var event_date = new Date($scope.events[i].start_time);
            if (event_date > df && event_date < dt){
                $scope.events[i].short_desc = ""
                if ($scope.events[i].description)
                  $scope.events[i].short_desc = $scope.events[i].description.split("\n")[0];
                $scope.events[i].venue = eventquery.getCoworkingVenue($scope.events[i]);
                result.push($scope.events[i]) ;
            }
        }

        $scope.events = $filter('orderBy')(result, 'start_time');

        var len = $scope.events.length,
            mid = Math.ceil(len/2);
        $scope.left = $scope.events.slice(0, mid);
        $scope.right = $scope.events.slice(mid, len);

    }
}]).
directive('eventDetail', function() {
    return {
        templateUrl: 'flyer/event-detail.html'
    };
});