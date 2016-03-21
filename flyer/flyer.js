'use strict';

angular.module('flyerApp.flyer', ['ngRoute', 'services.eventquery'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/flyer/:id',  {
        templateUrl: 'flyer/flyer.html',
        controller: 'FlyerCtrl'
    });
}])

.controller('FlyerCtrl', [ '$scope', '$routeParams', '$filter', 'eventquery',

function ($scope, $routeParams, $filter, eventquery) {
    $scope.draw = false;

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
            var start_time = $scope.events[i].start_time;

            // start_time as returned by FB Graph API isn't ISO 8601 compliant
            // make it so by adding the requiste colon in the timezone
            var event_date = new Date(start_time.slice(0,22) + ':' + start_time.slice(22));

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