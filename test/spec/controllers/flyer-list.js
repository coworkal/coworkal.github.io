'use strict';

describe('Controller: FlyerListCtrl', function () {

  // load the controller's module
  beforeEach(module('workspaceApp'));

  var FlyerListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FlyerListCtrl = $controller('FlyerListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FlyerListCtrl.awesomeThings.length).toBe(3);
  });
});
