'use strict';

/**
 * @ngdoc service
 * @name workspaceApp.eventquery
 * @description
 * # eventquery
 * Factory in the workspaceApp.
 */
angular.module('flyerApp')
  .factory('services.eventquery', ['$rootScope', 'Facebook',
  function ($rootScope, Facebook) {
    var eventqueryService = {};

    eventqueryService.events = [];
    eventqueryService._userIsConnected = false;
    eventqueryService.dataReadyCb = null;

    eventqueryService.getCurrent = function() {
        return new Date();
    };

    eventqueryService.isSdkReady = function() {
        return Facebook.isReady();
    };

    eventqueryService.retrieveEvents = function() {
        Facebook.api('/954447087970025', 'GET', {'fields':
        'events{owner,id,place,start_time,end_time,description,name,is_viewer_admin,attending_count,interested_count}' },
        function(response) {
            eventqueryService.events = response.events.data;
            if(eventqueryService.dataReadyCb) {
                eventqueryService.dataReadyCb();
            }
        });
    };

    eventqueryService.init_user = function () {
        if (eventqueryService.isSdkReady()) {
            Facebook.getLoginStatus(function(response) {
                if(response.status === 'connected') {
                    eventqueryService._userIsConnected = true;
                    eventqueryService.retrieveEvents();
                }
            });
        }
    };

    eventqueryService.isUserConnected = function () {
        return eventqueryService._userIsConnected;
    };

    eventqueryService.login = function() {
        if(!eventqueryService.isUserConnected()) {
            Facebook.login(function(response) {
                if (response.status === 'connected') {
                    eventqueryService._userIsConnected = true;
                    eventqueryService.retrieveEvents();
                }
            });
        }
    };

    eventqueryService.getEvents = function(id) {
        var result = [];
        var df = eventqueryService.getCoworkingDate(id);
        var dt = eventqueryService.getCoworkingDate(id);
        df.setDate(df.getDate() - 1);
        dt.setDate(dt.getDate() + 1);

        for (var i = 0; i < eventqueryService.events.length; i++) {
            var eventDate = new Date(eventqueryService.events[i].start_time);
            if (eventDate > df && eventDate < dt) {
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

            if (typeof event.place === 'undefined') {
                return $rootScope.coworkingVenues[0];
            }

            if (event.place.name.indexOf($rootScope.coworkingVenues[i].match) !== -1) {
                return $rootScope.coworkingVenues[i];
            }
        }
        return $rootScope.coworkingVenues[0];
    };

    return eventqueryService;
  }]);
