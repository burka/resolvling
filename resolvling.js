(function() {
  'use strict';
  /*global extend, angular*/

  angular.module('resolvling', []).service('Resolvling', ResolvlingFactory);

  ResolvlingFactory.$inject = [];

  /* @ngInject */
  function ResolvlingFactory() {
    this.resolvingWith = resolvingWith;
    this.insertDataIntoArray = insertDataIntoArray;
    this.insertDataIntoObject = insertDataIntoObject;

    function Resolvling(value, promise) {
      if (!(promise && promise.then))
        throw Error("Can't create a resolvling without a promise");

      shallowClearAndCopy(value || {}, this);
      var updateable = this;
      this.$resolved = false;
      this.$promise = promise.then(function resolve(data) {
        insertDataIntoObject(data, updateable);
        return data;
      });
    }

    Resolvling.prototype.toJSON = function() {
      var data = angular.extend({}, this);
      delete data.$promise;
      delete data.$resolved;
      return data;
    };

    function resolvingWith(promise) {
      return new Resolvling({}, promise);
    }

    function insertDataIntoArray(data, array) {
      if (!angular.isArray(data) || !angular.isArray(array))
        throw new Error('Please provide an array as value and data.');

      data.forEach(function(item) {
        array.push(item);
      });
    }

    function insertDataIntoObject(data, value) {
      if (angular.isArray(data) || angular.isArray(value))
        throw new Error(
          'Please provide an object as value and data. ' +
          'Use Updateable.insertDataIntoArray(data, array) if you wish to update an array.')

      var promise = value.$promise;
      shallowClearAndCopy(data, value);
      value.$promise = promise;
      value.$resolved = true;
    }

    function shallowClearAndCopy(src, dst) {
      angular.forEach(dst, function(value, key) {
        delete dst[key];
      });

      for (var key in src) {
        if (src.hasOwnProperty(key) &&
          !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
          dst[key] = src[key];
        }
      }
      return dst;
    }
  }
})();
