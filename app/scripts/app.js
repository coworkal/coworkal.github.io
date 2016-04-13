'use strict';

/**
 * @ngdoc overview
 * @name workspaceApp
 * @description
 * # workspaceApp
 *
 * Main module of the application.
 */
angular.module('flyerApp', [
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'facebook'
  ])
  .config([
    'FacebookProvider',
    function(FacebookProvider) {
      var myAppId = '588036218022182';
      FacebookProvider.init(myAppId);
    }
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/flyer/:id', {
        templateUrl: 'views/flyer.html',
        controller: 'FlyerCtrl',
        controllerAs: 'flyer'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/flyer-list', {
        templateUrl: 'views/flyer-list.html',
        controller: 'FlyerListCtrl',
        controllerAs: 'flyerList'
      })
      .when('/schedule/:id', {
        templateUrl: 'views/schedule.html',
        controller: 'ScheduleCtrl',
        controllerAs: 'schedule'
      })
      .when('/lint', {
        templateUrl: 'views/lint.html',
        controller: 'LintCtrl',
        controllerAs: 'lint'
      })
      .otherwise({
        redirectTo: '/home'
      });
  })
  .run(['$rootScope', '$http', function($rootScope, $http) {
    $rootScope.coworkingNights = [];
    $rootScope.coworkingVenues = [];

    $http.get('events.json').success(function(data) {
      for(var i = 0; i < data.events.length; i++) {
        data.events[i].date = new Date(data.events[i].date);
      }
      $rootScope.coworkingNights = data.events;
      $rootScope.coworkingVenues = data.venues;
    });

  }]);
