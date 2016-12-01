(function(angular){
"use strict";

angular.module('zeus-code', ['ngAnimate', 'ngResource', 'ui.router', 'ui.bootstrap', 'angular-loading-bar'])
.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {

		$urlRouterProvider.otherwise("/");
		
		$stateProvider	
		.state('list', {
			  url: "/:view",
			  params: {
			  	view: undefined
			  },
		      views: {
		      	"@": {
		              templateUrl: function($stateParams){
		              	if($stateParams.view === 'list')
		              		return 'views/list.html';
		              	else
		              		return 'views/tiles.html';
		              },
		              controller: ['Node', function(Node){
		              	this.list = [];
		              	var self = this;
		              	
		              	Node.query().$promise
		              	.then(function(data){
		              		self.list = data;
		              	})
		              	.catch(function(err){
		              		console.error(err);
		              		throw err;
		              	});
		              	
		              	this.createItem = function(){
		              		Node.save().$promise
		              		.then(function(node){
	              				self.list.push(node);
	              			})
	              			.catch(function(err){
	              				console.error(err);
	              				throw err;
	              			});

		              	}
		              }],
		              controllerAs: 'masterVm'
		      	}
		      }
		    });
	}]);

})(angular);
