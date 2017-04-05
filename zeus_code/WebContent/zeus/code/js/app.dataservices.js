(function(angular){
"use strict";

	angular.module('zeus-code')
	.service('ResourceSvcConfiguration', ['$log', function($log) {
		return {
			cfg: {
			    save: {
			        method: 'POST',
			        interceptor: {
		                response: function(res) {
		                	var location = res.headers('Location');
		                	if(location){
		                		var id = location.substring(location.lastIndexOf('/')+1);
		                		angular.extend(res.resource, { "ideaId": id });
	                		} else {
	                			$log.error('Cannot infer id after save operation. HTTP Response Header "Location" is missing: ' + location);
	            			}
	                        return res.resource;
		                }
		            }, 
		            isArray: false
			    },
			    update: {
			        method: 'PUT'
			    }
		    }
		};
	}])
	.service('Node', ['$resource', 'ResourceSvcConfiguration', function($resource, ResourceSvcConfiguration) {
		var cfg = angular.copy(ResourceSvcConfiguration.cfg);
	  	return $resource('../../../js-secured/zeus/code.js/:nodeId', { nodeId:'@id' }, cfg);
	}])
	.service('NodeCount', ['$resource', function($resource) {
	  	return $resource('../../js-secured/zeus/code.js/count', {}, 
	  			{get: {method:'GET', params:{}, isArray:false, ignoreLoadingBar: true}});
	}])	
})(angular);
