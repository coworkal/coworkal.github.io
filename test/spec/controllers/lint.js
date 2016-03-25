'use strict';

describe('Controller: LintCtrl', function () {

  // load the controller's module
  beforeEach(module('workspaceApp'));

  var LintCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LintCtrl = $controller('LintCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LintCtrl.awesomeThings.length).toBe(3);
  });
});
