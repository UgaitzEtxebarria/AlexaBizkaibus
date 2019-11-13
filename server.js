'use strict';

var AlexaAppServer = require('alexa-app-server');
 
var instance = new AlexaAppServer({
  server_root: __dirname,     // Path to root
  public_html: "public_html", // Static content
  app_dir: "apps",            // Location of alexa-app modules
  app_root: "/alexa/",        // Service root
  port: process.env.PORT || 8080                  // Port to use
});

server.start();
server.express.use('/test', function(req, res) { res.send("OK"); });