'use strict';

var AlexaAppServer = require('alexa-skill-bizkaibus');

var server = new AlexaAppServer( {
	httpsEnabled: false,
	port: process.env.PORT || 3001
} );

server.start(); 