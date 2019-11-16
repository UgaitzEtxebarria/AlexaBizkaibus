'use strict';

const express = require('express');
var AlexaAppServer = require('alexa-app-server');
/*const { Core } = require('ask-sdk-core');
console.log("Pre");
const { ExpressAdapter } = require('ask-sdk-express-adapter');
 */
var server = new AlexaAppServer({
  server_root: __dirname,     // Path to root
  public_html: "public_html", // Static content
  app_dir: "apps",            // Location of alexa-app modules
  app_root: "/alexa/",        // Service root
  verify: true,
  port: process.env.PORT || 8080                  // Port to use
});

const app = express();
/*
console.log("A");

const skillBuilder = Alexa.SkillBuilders.custom();
console.log("B");
const skill = skillBuilder.create();
console.log("C");
const adapter = new ExpressAdapter(skill, true, true);
console.log("D");
*/
app.post('/', (req, res) => {
  console.log("Signature: " + req.headers['signaturecertchainurl'])
});

app.get('/', (req, res) => {
  console.log("Signature get: " + req.headers['signaturecertchainurl'])
});

server.start();