module.change_code = 1;
'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('alexa-skill-bizkaibus');


app.launch( function(request, response) {
    console.log('Example app listening on port 3000!');
    response.say('Welcome to your alexa skill')
    .reprompt('Ask alexa to say hello world!')
    .shouldEndSession(false);
} );


app.error = function(exception, request, response) {
    console.log(exception)
    console.log(request);
    console.log(response);  
    response.say('Sorry an error occured ' + error.message);
};

app.intent('proximo_bus',
  {
    "utterances":[ 
        "say hello world",
        "tell me hello world"]
  },
  function(request,response) {
    response.say("Hello, world!");
  }
);

module.exports = app;