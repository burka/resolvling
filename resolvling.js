(function(angular) {
	'use strict';
	/*global extend*/

	angular.module('resolvling', []).service('Resolvling', ResolvlingFactory);

	ResolvlingFactory.$inject = [];

	/* @ngInject */
	function ResolvlingFactory() {
		this.resolvingWith = resolvingWith;
		this.insertDataIntoArray = insertDataIntoArray;

		function Resolvling(value, promise) {
			this.$resolved = true;
			shallowClearAndCopy(value || {}, this);
			if (promise && promise.then) {
				this.$resolved = false;
				var updateable = this;
				this.$promise = promise.then(function resolve(data) {
					update(data, updateable);
					return data;
				});
			}
		}

		Resolvling.prototype.toJSON = function() {
			var data = extend({}, this);
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

		function update(data, value) {
			if (!angular.isObject(data) || !angular.isObject(value))
				throw new Error(
						'Please provide an object as value and data. '
								+ 'Use Updateable.insertDataIntoArray(data, array) if you wish to update an array.')

			var promise = value.$promise;
			shallowClearAndCopy(data, value);
			value.$promise = promise;
			value.$resolved = true;
		}

		function shallowClearAndCopy(src, dst) {
			angular.forEach(dst, function(value, key) {
				delete dst[key];
			});

			for ( var key in src) {
				if (src.hasOwnProperty(key)
						&& !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
					dst[key] = src[key];
				}
			}
			return dst;
		}
	}
})(window.angular);