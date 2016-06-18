# angular resolvling
Self resolving objects with provided promise.

````
function get(enumType){
var enums = $resource('/enums/:locale').get({locale:'en'});
var promise = enums.$promise.then(transformResult);
var value = Resolvling.resolvingWith(promise);
return value;
	
function transformResult(enums) {
	if (!(enumType in enums))
		throw 'Enum values for ' + enumType
				+ ' unknown. Known types are: '
				+ Object.keys(enums);
	return enums[enumType];
}
}
````