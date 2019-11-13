'use strict';

var AlexaAppServer = require('alexa-app-server');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
 
var server = new AlexaAppServer({
  server_root: __dirname,     // Path to root
  public_html: "public_html", // Static content
  app_dir: "apps",            // Location of alexa-app modules
  app_root: "/alexa/",        // Service root
  port: process.env.PORT || 8080                  // Port to use
});

server.post('/', adapter.getRequestHandlers());

server.start();