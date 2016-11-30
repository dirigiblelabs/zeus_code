(function(angular){
"use strict";

angular.module('zeus-code', ['ngAnimate', 'ngResource', 'ui.router', 'ui.bootstrap', 'angular-loading-bar'])
.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {

		$urlRouterProvider.otherwise("/");
		
		$stateProvider	
		.state('list', {
			  url: "/",
		      views: {
		      	"@": {
		              templateUrl: 'views/master.html',
		              controller: ['Node', function(Node){
		              	this.list = [{
		              		cn_id: 1,
		              		cn_name: "dirigible_123456"
		              	},{
      			            cn_id: 2,
		              		cn_name: "dirigible_98765"
		              	}];
		              	var self = this;
		              	
/*		              	Node.query().$promise
		              	.then(function(data){
		              		self.list = data;
		              	})
		              	.catch(function(err){
		              		console.error(err);
		              		throw err;
		              	});*/
		              }],
		              controllerAs: 'masterVm'
		      	}
		      }
		    });
	}]);

})(angular);