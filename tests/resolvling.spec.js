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

  describe('resolves when', function() {
    it('promise resolves', function() {
      var resolvling = Resolvling.resolvingWith(promisedValue);

      resolveWith({
        a: 'a'
      });

      expect(resolvling.a).toBe('a');
    });

    it('chained with other promises', function() {
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

    it('promise was already resolved', function() {
      resolveWith({
        a: 'a'
      });
      var resolvling = Resolvling.resolvingWith(promisedValue);
      $rootScope.$apply();

      expect(resolvling.a).toBe('a');
    });

    it('JSON.stringify(resolvling) ignoring $values', function() {
      var resolvingWith = {
        a: 'a'
      };

      var resolvling = Resolvling.resolvingWith(promisedValue);
      resolveWith(resolvingWith);
      $rootScope.$apply();

      var jsonValue = JSON.stringify(resolvling);
      var jsonSourceValue = JSON.stringify(resolvingWith);
      expect(jsonValue).toBe(jsonSourceValue);
    });
    it('ignores angular variables', function() {
      var resolvingWith = {
        a: 'a',
        '$$internal': 'internal'
      };

      var resolvling = Resolvling.resolvingWith(promisedValue);
      resolveWith(resolvingWith);
      $rootScope.$apply();

      expect(resolvling.$$internal).not.toBeDefined();
    });
  });

  describe('throws an error if', function() {
    it('created with null promise.', function() {
      expect(function() {
        Resolvling.resolvingWith(null);
      }).toThrow();
    });
    it('not resolved with an object', function() {
      expect(function() {
        var resolvling = Resolvling.resolvingWith(promisedValue);
        resolveWith([1, 2, 3]);
        expect(resolvling).toBe(false);
      }).toThrow();
    });
  });

  it('replaces data in provided array', function() {
    var array = [];
    expect(array.length).toBe(0);
    Resolvling.insertDataIntoArray(['something'], array);
    expect(array.indexOf('something')).toBe(0);
  });
  it('throws if non arrays are tried with array copy', function() {
    expect(function() {
      Resolvling.insertDataIntoArray({}, []);
    }).toThrow();
    expect(function() {
      Resolvling.insertDataIntoArray([], {});
    }).toThrow();
  })

  function resolveWith(value) {
    promisedValue.$resolve(value);
    $rootScope.$apply();
  }
});