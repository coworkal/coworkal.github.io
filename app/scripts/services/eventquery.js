'use strict';

/**
 * @ngdoc service
 * @name workspaceApp.eventquery
 * @description
 * # eventquery
 * Factory in the workspaceApp.
 */
angular.module('flyerApp')
  .factory('services.eventquery', ['$rootScope', '$http',
  function ($rootScope, $http) {
    var eventqueryService = {};

    eventqueryService.events = [];
    eventqueryService._userIsConnected = false;
    eventqueryService.dataReadyCb = null;

    eventqueryService.getCurrent = function() {
        return new Date();
    };

    eventqueryService.isSdkReady = function() {
        return true;
    };

    eventqueryService.retrieveEvents = function() {
      $http({
        method: 'GET',
        url: 'https://script.google.com/macros/s/AKfycbxDCvI79Q_lV8EHvirA-t44q6pbDkPi1hdMWE3jH73wVaDxH1A/exec'}).then(      function(response) {
            eventqueryService.events = response.data;
            console.log(response);
            if(eventqueryService.dataReadyCb) {
                eventqueryService.dataReadyCb();
            }
        });
    };

    eventqueryService.getEvents = function(id) {
        var result = [];
        for (var i = 0; i < eventqueryService.events.length; i++) {
            console.log(events[i].cwn, id);
            if (events[i].cwn == id) {
                result.push(eventqueryService.events[i]);
            }
        }
        return result;
    };

    eventqueryService.getCoworkingDate = function(id) {
        for (var i = 0; i < $rootScope.coworkingNights.length; i++) {
            if (id === $rootScope.coworkingNights[i].id) {
                return new Date($rootScope.coworkingNights[i].date);
            }
        }
    };

    eventqueryService.getCoworkingId = function(event) {
        for (var i = 0; i < $rootScope.coworkingNights.length; i++) {
            var eventDate = new Date(event.start_time);
            var nightDate = new Date($rootScope.coworkingNights[i].date);

            if ( eventDate.getDate() === nightDate.getDate() &&
                 eventDate.getMonth() === nightDate.getMonth() &&
                 eventDate.getYear() === nightDate.getYear() ) {
               return $rootScope.coworkingNights[i].id;
            }
        }
        return -1;
    };

    eventqueryService.getCoworkingVenue = function(event) {
        for (var i = 0; i < $rootScope.coworkingVenues.length; i++) {

            if (typeof event.room=== 'undefined') {
                return $rootScope.coworkingVenues[0];
            }

            if (event.room.indexOf($rootScope.coworkingVenues[i].match) !== -1) {
                return $rootScope.coworkingVenues[i];
            }
        }
        return $rootScope.coworkingVenues[0];
    };

    return eventqueryService;
  }]);
