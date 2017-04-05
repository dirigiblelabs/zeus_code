/* globals $ */
/* eslint-env node, dirigible */

var request = require('net/http/request');
var response = require('net/http/response');
var applications = require('zeus/utils/applications');
var uuid = require('utils/uuid');
var cluster = require('zeus/utils/cluster');

var devInstancesDao = require('zeus/code/dao/devInstancesDao');

handleRequest(request, response);

function handleRequest(httpRequest, httpResponse) {
	try {
		dispatchRequest(httpRequest, httpResponse);
	} catch (e) {
		console.error(e);
		sendResponse(httpResponse, httpResponse.BAD_REQUEST, 'text/plain', e);
	}
}

function dispatchRequest(httpRequest, httpResponse) {
	response.setContentType('application/json; charset=UTF-8');
	response.setCharacterEncoding('UTF-8');

	switch (httpRequest.getMethod()) {
		case 'GET':
			handleGetRequest(httpRequest, httpResponse);
			break;
		case 'POST': 
			handlePostRequest(httpRequest, httpResponse);
			break;
		default:
			handleNotAllowedRequest(httpResponse);
	}
}

function handleGetRequest(httpRequest, httpResponse) {
	var devInstances = devInstancesDao.list(null, null, null, null);
	sendResponse(response, httpResponse.OK, 'application/json', JSON.stringify(devInstances));
}


function handlePostRequest(httpRequest, httpResponse) {
	// TODO To be discovered which template is the default dev stack
	var applicationTemplateId = 1;
	var applicationName = 'dev-' + uuid.random();
	applicationName = applicationName.substring(0, 11);

	var devInstance = applications.deploy(applicationTemplateId, applicationName, getIngress(applicationName));

	sendResponse(httpResponse, httpResponse.CREATED, 'application/json', JSON.stringify(devInstance));
}

function getIngress(applicationName) {
	return {
		'applicationName': applicationName,
		'host': applicationName + '.apps.eu-central-1.sap.onvms.com', // TODO To be provisioned via clusterSettings.domain !!!
		'name': applicationName,
		'namespace': cluster.getSettings().namespace,
		'path': '/',
		'serviceName': applicationName + '-http',
		'servicePort': 8080,
		'isDevInstance': true,
		'labels': {
			'applicationName': applicationName
		}
	};
}

function handleNotAllowedRequest(httpResponse) {
	sendResponse(httpResponse, httpResponse.METHOD_NOT_ALLOWED);
}

function sendResponse(response, status, contentType, content) {
	response.setStatus(status);
	response.setContentType(contentType);
	response.println(content);
	response.flush();
	response.close();	
}
