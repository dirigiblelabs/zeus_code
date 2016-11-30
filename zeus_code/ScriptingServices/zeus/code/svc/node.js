/* globals $ */
/* eslint-env node, dirigible */
(function(){
"use strict";
	
	var arester = require("arestme/arester");

	var nodeDAO = require("zeus/code/lib/node_dao");
	var Node = arester.asRestAPI(nodeDAO);
	Node.prototype.logger.ctx = "Node Svc";
	
	var node = new Node(nodeDAO);	
	
	(function(node) {

		var request = require("net/http/request");
		var response = require("net/http/response");
		
		node.service(request, response);
		
	})(node);	
	
})();
