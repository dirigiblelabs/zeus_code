/* globals $ */
/* eslint-env node, dirigible */
(function(){
"use strict";
	
	var arester = require("arestme/arester");

	var nodeDAO = require("zeus/code/lib/node_dao");
	var Node = arester.asRestAPI(nodeDAO);
	Node.prototype.logger.ctx = "Node Svc";
	
	Node.prototype.cfg[""].post.produces = "application/json";
	Node.prototype.cfg[""].post.handler = function(context, io) {
	    try{
			
			var httpClient = require('net/http/client');
			var namespace = "default";
			var deploymentData = {
				'name': null,
				'image': 'docker.io/dirigiblelabs/dirigible-tomcat:latest',
				'replicas': 1,
				'env': [{
					'name': 'DefaultDB_username',
					'value': 'root'
				}],
				'autoscale': {
					'enabled': false,
					'minReplicas': 1,
					'maxReplicas': 5,
					'targetCPUUtilizationPercentage': 50
				}
			};
		
			var httpResponse = httpClient.post('js/zeus/api/landscapes.js?namespace=' + namespace,{ 
				'body': JSON.stringify(deploymentData)
			});
		
			var data = JSON.parse(httpResponse.data);
			console.info(JSON.stringify(data));
	    	//TODO: request new landscape instance
	    	var nodeJson = {
	    		cn_name: "dirigible_123_" + new Date().toString(),
	    		cn_url: ""
	    	};
	    	io.response.println(JSON.stringify(nodeJson));
			io.response.setStatus(io.response.OK);
			io.response.setHeader('Location', nodeJson.url);
		} catch(e) {
    	    var errorCode = io.response.INTERNAL_SERVER_ERROR;
    	    this.logger.error(errorCode, e.message, e.errContext);
        	this.sendError(io, errorCode, errorCode, e.message, e.errContext);
        	throw e;
		}
	};

	var node = new Node(nodeDAO);	
	
	(function(node) {

		var request = require("net/http/request");
		var response = require("net/http/response");
		
		node.service(request, response);
		
	})(node);	
	
})();
