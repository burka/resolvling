# Angular Resolvling

Self resolving objects for angular promises.

[![CircleCI](https://circleci.com/gh/burka/resolvling/tree/master.svg?style=shield)](https://circleci.com/gh/burka/resolvling/tree/master) 
[![codecov](https://codecov.io/gh/burka/resolvling/branch/master/graph/badge.svg)](https://codecov.io/gh/burka/resolvling)

````
function get(enumType){
var enums = $resource('/enums/:locale').get({locale:'en'});
var promise = enums.$promise.then(function transformResult(enums) {
		return enums[enumType];
	});
var value = Resolvling.resolvingWith(promise);
return value;
	
}
````