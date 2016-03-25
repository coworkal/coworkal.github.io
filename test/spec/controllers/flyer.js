'use strict';

describe('Controller: FlyerCtrl', function () {

  // load the controller's module
  beforeEach(module('workspaceApp'));

  var FlyerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FlyerCtrl = $controller('FlyerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FlyerCtrl.awesomeThings.length).toBe(3);
  });
});
