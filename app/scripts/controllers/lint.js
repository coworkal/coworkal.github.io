'use strict';

/**
 * @ngdoc function
 * @name workspaceApp.controller:LintCtrl
 * @description
 * # LintCtrl
 * Controller of the workspaceApp
 */
angular.module('flyerApp')
  .controller('LintCtrl', ['$scope', '$routeParams', '$filter', 'services.eventquery',
  function($scope, $routeParams, $filter, eventquery) {
    $scope.draw = false;

    eventquery.dataReadyCb = function() {
        $scope.events = eventquery.events;
        $scope.check_events();
        $scope.draw = true;
    };

    $scope.$watch(
        function() {
            eventquery.isSdkReady();
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

    var check_title = function(title) {
        if (title.length > 44)
        {
            return 'Title > 44 chars';
        }
        return 'Pass';
    };

    var check_description = function(description) {
        if (typeof description === 'undefined') {
            return 'Description Undefined';
        }


        var short_desc = description.split('\n')[0];
        if (short_desc.length > 150) {
            return 'Description > 150 chars';
        }
        return 'Pass';
    };

    var check_time = function(d, time) {
        if (typeof time === 'undefined') {
            return d + ' Time Undefined';
        }
        return 'Pass';
    };

    $scope.check_events = function() {
        $scope.results = [];
        for (var i = 0; i < $scope.events.length; i++) {
            var result = $scope.events[i];
            result.check = {};
            result.place = eventquery.getCoworkingVenue(result);
            result.check.size = 'Pass';

            var num_people = result.attending_count + 0.5 * result.interested_count;

            if (result.place.full !== 'To Be Posted') {
                if (num_people >= 2* result.place.capacity) {
                    result.check.size = 'Over Capacity';
                } else if (num_people >= result.place.capacity) {
                    result.check.size = 'Full';
                }
            }

            result.check.title = check_title(result.name);
            result.check.description = check_description(result.description);
            result.check.start = check_time('Start', result.start_time);
            result.check.end = check_time('Stop', result.end_time);
            result.night_id = eventquery.getCoworkingId(result);
            $scope.results.push(result);
        }
        $scope.results = $filter('orderBy')($scope.results, 'start_time');

        $scope.upcoming = [];
        $scope.past = [];
        var today = new Date();
        for(i = 0; i < $scope.results.length; i++) {
            var event_date = new Date($scope.results[i].start_time);

            if (event_date >= today)
            {
                $scope.upcoming.push($scope.results[i]);
            }
            else
            {
                $scope.past.push($scope.results[i]);
            }
        }
    };
}]);
