angular.module('services.eventquery', []).

factory('eventquery', ['$rootScope', 'Facebook',
function($rootScope, Facebook) {
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
                if(response.status == 'connected') {
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
                if (response.status == 'connected') {
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
            var event_date = new Date(eventqueryService.events[i].start_time);
            if (event_date > df && event_date < dt) {
                result.push(eventqueryService.events[i]);
            }
        }
        return result;
    };

    eventqueryService.getCoworkingDate = function(id) {
        for (var i = 0; i < $rootScope.coworking_nights.length; i++) {
            if (id == $rootScope.coworking_nights[i].id) {
                return new Date($rootScope.coworking_nights[i].date);
            }
        }
    };

    eventqueryService.getCoworkingId = function(event) {
        for (var i = 0; i < $rootScope.coworking_nights.length; i++) {
            var event_date = new Date(event.start_time);
            var night_date = new Date($rootScope.coworking_nights[i].date);

            if ( event_date.getDate() == night_date.getDate() && event_date.getMonth() == night_date.getMonth() && event_date.getYear() == night_date.getYear() ) {
               return $rootScope.coworking_nights[i].id;
            }
        }
        return -1;
    };

    eventqueryService.getCoworkingVenue = function(event) {
        for (var i = 0; i < $rootScope.coworking_venues.length; i++) {
            if (event.place.name.indexOf($rootScope.coworking_venues[i].match) != -1) {
                return $rootScope.coworking_venues[i];
            }
        }
        return $rootScope.coworking_venues[0];
    };

    return eventqueryService;
}]);