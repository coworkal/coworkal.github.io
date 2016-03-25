'use strict';

/**
 * @ngdoc directive
 * @name workspaceApp.directive:eventDetail
 * @description
 * # eventDetail
 */
angular.module('flyerApp')
  .directive('eventDetail', function () {
    return {
      templateUrl: 'views/event-detail.html'
    };
  });
