'use strict';

/**
 * @ngdoc function
 * @name workspaceApp.controller:FlyerCtrl
 * @description
 * # FlyerCtrl
 * Controller of the workspaceApp
 */
angular.module('flyerApp')
  .controller('FlyerCtrl', ['$scope', '$routeParams', '$filter', 'services.eventquery',
  function ($scope, $routeParams, $filter, eventquery) {
    eventquery.retrieveEvents();
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
        $scope.night_id = parseInt($routeParams.id);
        $scope.date = eventquery.getCoworkingDate($scope.night_id);
        $scope.draw_events();
        $scope.draw = true;
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
            console.log($scope.events[i])
            var event_date = new Date(start_time.slice(0,22) + ':' + start_time.slice(22));

            if ($scope.events[i].cwn == $scope.night_id){
                $scope.events[i].short_desc = '';
                if ($scope.events[i].description) {
                  $scope.events[i].short_desc = $scope.events[i].description.split('\n')[0];
                }
                $scope.events[i].venue = eventquery.getCoworkingVenue($scope.events[i]);
                result.push($scope.events[i]) ;
            }
        }

        $scope.events = $filter('orderBy')(result, 'start_time');

        var len = $scope.events.length,
            mid = Math.ceil(len/2);
        $scope.left = $scope.events.slice(0, mid);
        $scope.right = $scope.events.slice(mid, len);
    };

        $scope.events = eventquery.events;
        $scope.night_id = parseInt($routeParams.id);
        $scope.date = eventquery.getCoworkingDate($scope.night_id);
        $scope.draw_events();
        $scope.draw = true;

  }]);
