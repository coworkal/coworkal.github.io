'use strict';

describe('Service: eventquery', function () {

  // load the service's module
  beforeEach(module('workspaceApp'));

  // instantiate service
  var eventquery;
  beforeEach(inject(function (_eventquery_) {
    eventquery = _eventquery_;
  }));

  it('should do something', function () {
    expect(!!eventquery).toBe(true);
  });

});
