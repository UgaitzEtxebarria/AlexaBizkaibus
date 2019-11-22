'use strict';

var AlexaAppServer = require('alexa-app-server');

var isDebug = false;

var server = new AlexaAppServer({
  server_root: __dirname,     // Path to root
  public_html: "public_html", // Static content
  app_dir: "apps",            // Location of alexa-app modules
  app_root: "/alexa/",        // Service root
  verify: !isDebug,
  debug: isDebug,
  port: process.env.PORT || 8080                  // Port to use
});

server.start();