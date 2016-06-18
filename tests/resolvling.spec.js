describe('resolvling', function() {
  'use strict';
  /*global inject, expect*/

  var Resolvling;
  var $q;
  var promisedValue;
  var $rootScope;

  beforeEach(module('resolvling'));

  beforeEach(inject(function(_Resolvling_, _$q_, _$rootScope_) {
    Resolvling = _Resolvling_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    var deferred = $q.defer();
    promisedValue = deferred.promise;
    promisedValue.$resolve = deferred.resolve;
    promisedValue.$reject = deferred.reject;
  }));

  it('resolves if promise resolves', function() {
    var resolvling = Resolvling.resolvingWith(promisedValue);

    resolveWith({
      a: 'a'
    });

    expect(resolvling.a).toBe('a');
  });


  it('can be chained with other promises', function() {
    var resolvling = Resolvling.resolvingWith(promisedValue);
    var chainedResult;
    resolvling.$promise.then(function(value) {
      chainedResult = value;
    })

    resolveWith({
      a: 'a'
    });

    expect(chainedResult.a).toBe('a');
  });

  it('resolves if promise was already resolved', function() {
    resolveWith({
      a: 'a'
    });

    var resolvling = Resolvling.resolvingWith(promisedValue);
    $rootScope.$apply();

    expect(resolvling.a).toBe('a');
  });

  function resolveWith(value) {
    promisedValue.$resolve(value);
    $rootScope.$apply();
  }
});