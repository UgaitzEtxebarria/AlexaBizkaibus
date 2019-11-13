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

const skillBuilder = Alexa.SkillBuilders.custom();
const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, true, true);

server.post('/', adapter.getRequestHandlers());

server.start();