/* globals $ */
/* eslint-env node, dirigible */
(function(){
"use strict";
	
	var arester = require("arestme/arester");

	var nodeDAO = require("zeus/code/lib/node_dao");
	var Node = arester.asRestAPI(nodeDAO);
	Node.prototype.logger.ctx = "Node Svc";
	
	Node.prototype.cfg[""].post.produces = "application/json";
	Node.prototype.cfg[""].get.handler = function(context, io) {
		var httpClient = require('net/http/client');
			var namespace = "default";
			var httpResponse = httpClient.get('http://localhost:8080/services/js/zeus/api/landscapes.js?namespace=' + namespace);

			var data = JSON.parse(httpResponse.data);
	    	io.response.println(JSON.stringify(data));
			io.response.setStatus(io.response.OK);
	};

	Node.prototype.cfg[""].post.handler = function(context, io) {
	    try{
			var httpClient = require('net/http/client');
			var namespace = "default";
			var deploymentData = {
				'name': 'deck-' + new Date().getTime(),
				'image': 'docker.io/dirigiblelabs/dirigible-tomcat:latest',
				'replicas': 1,
				'env': [{
					'name': 'DefaultDB_username',
					'value': 'root'
				}]
			};

			var httpResponse = httpClient.post('http://localhost:8080/services/js/zeus/api/landscapes.js?namespace=' + namespace, { 
				'headers': [],
				'body': JSON.stringify(deploymentData)
			});

			var data = JSON.parse(httpResponse.data);
			var env = require('core/env');
			var url = env.get('zeus.landscapes.ip') + ':' + data.service.spec.ports[0].nodePort;
			data = data.deployment;
			data.url = url;
    		
	    	io.response.println(JSON.stringify(data));
			io.response.setStatus(io.response.OK);
			io.response.setHeader('Location', data.url);
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
