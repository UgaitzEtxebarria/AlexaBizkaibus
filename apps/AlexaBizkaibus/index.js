
module.change_code = 1;
'use strict';

const https = require('https');
var alexa = require('alexa-app');
var app = new alexa.app('alexa-skill-bizkaibus');


app.launch(function (request, response) {
  response.say('Bienvenido a la skill de Bizkaibus').reprompt('Way to go. You got it to run. Bad ass.').shouldEndSession(false);
});


app.error = function (exception, request, response) {
  console.log(exception)
  console.log(request);
  console.log(response);
  response.say('Sorry an error occured ' + error.message);
};

app.intent('proximo_autobus',
  {
    //"slots":{"number":"NUMBER"},
    "utterances": [
      "Cuando llega el siguiente autobus",
      "Cual es el siguiente bus",
      "El proximo bus"]
  },
  function (request, response) {
    //var number = request.slot('number');
    var resource = "http://apli.bizkaia.net/APPS/DANOK/TQWS/TQ.ASMX/GetPasoParadaMobile_JSON?callback=%22%22&strLinea=A3612&strParada=0270";
    https.get(resource, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        response.say(console.log(JSON.parse(data).explanation));
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
    //response.say("Cuando llegue!");
  }
);

app.intent("AMAZON.HelpIntent", {
  "slots": {},
  "utterances": []
},
  function (request, response) {
    var helpOutput = "You can say 'some statement' or ask 'some question'. You can also say stop or exit to quit.";
    var reprompt = "What would you like to do?";
    // AMAZON.HelpIntent must leave session open -> .shouldEndSession(false)
    response.say(helpOutput).reprompt(reprompt).shouldEndSession(false);
  }
);

app.intent("AMAZON.StopIntent", {
  "slots": {},
  "utterances": []
}, function (request, response) {
  var stopOutput = "Hasta pronto!";
  response.say(stopOutput);
}
);

app.intent("AMAZON.CancelIntent", {
  "slots": {},
  "utterances": []
}, function (request, response) {
  var cancelOutput = "De acuerdo, cancelado.";
  response.say(cancelOutput);
}
);

module.exports = app;