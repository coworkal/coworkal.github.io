'use strict';

/**
 * @ngdoc function
 * @name workspaceApp.controller:FlyerListCtrl
 * @description
 * # FlyerListCtrl
 * Controller of the workspaceApp
 */
angular.module('flyerApp')
  .controller('FlyerListCtrl', [ '$scope', '$rootScope',
    function ($scope, $rootScope) {
      $scope.events = [];
      $scope.upcoming = [];
      $scope.past = [];
      $scope.nextEvent = {};

      var drawList = function() {
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        for (var i = 0; i < $rootScope.coworkingNights.length; i++) {
            var eventDate = $rootScope.coworkingNights[i].date;

            if (eventDate >= today)
            {
                $scope.upcoming.push($rootScope.coworkingNights[i]);
            }
            else
            {
                $scope.past.push($rootScope.coworkingNights[i]);
            }
        }
        $scope.nextEvent = $scope.upcoming[0];
        $scope.upcoming.shift();
      };

      $scope.$watch(
        function() {
          return $rootScope.coworkingNights.length > 0;
        },
        function(newVal) {
          drawList(newVal);
        }
      );
}]);
