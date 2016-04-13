'use strict';

angular.module('flyerApp')
  .controller('HomeCtrl', ['$scope', '$rootScope', '$routeParams', '$filter', 'services.eventquery',
  function ($scope, $rootScope, $routeParams, $filter, eventquery) {
    $scope.draw = false;

    setCarouselHeight('#testimonial-carousel');

    function setCarouselHeight(id)
    {
        var slideHeight = [];
        $(id+' .carousel-item').each(function()
        {
            // add all slide heights to an array
            slideHeight.push($(this).height());
        });

        // find the tallest item
        var max = Math.max.apply(null, slideHeight);

        // set the slide's height
        $(id+' .carousel-content').each(function()
        {
            $(this).css('height',max+'px');
        });
    };


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
