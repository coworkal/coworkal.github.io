'use strict';

describe('Directive: eventDetail', function () {

  // load the directive's module
  beforeEach(module('workspaceApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<event-detail></event-detail>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the eventDetail directive');
  }));
});
