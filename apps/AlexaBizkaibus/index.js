
module.change_code = 1;
'use strict';

const http = require('http');
var xml2js = require('xml2js');
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
    "slots":{"number": "AMAZON.NUMBER"},
    "utterances": [
      "Cuando llega el siguiente autobus a la parada {-|number}",
      "Cual es el siguiente bus en {-|number}",
      "El proximo bus en {-|number}"]
  },
  function (request, response) {
    var number = request.slot('number');
    var url = "";
    console.log("Numero de parada: ", number);
    if(typeof number !== 'undefined' && number !== null)
      url = 'http://apli.bizkaia.net/APPS/DANOK/TQWS/TQ.ASMX/GetPasoParadaMobile_JSON?callback=%22%22&strLinea=A3612&strParada=' + number;
    else
      url = 'http://apli.bizkaia.net/APPS/DANOK/TQWS/TQ.ASMX/GetPasoParadaMobile_JSON?callback=%22%22&strLinea=A3612&strParada=0270';
      console.log("URL: ", url);

  http.get(url, function(res){
      var body = '';
  
      res.on('data', function(chunk){
          body += chunk;
      });
  
      res.on('end', function(){
        //console.log("Got a response: ", body);
        body = body.replace("\"\"(","").replace(");","").replace(new RegExp("'", 'g'),"\"");

        //console.log("Cleaned: ", body);
        var JSONResponse = JSON.parse(body);
        //console.log("JSON: ", JSONResponse);

        if (JSONResponse["STATUS"] == "OK")
        {
            console.log("Esta OK!");
            var xml  = JSONResponse["Resultado"];
            console.log("resultado: ", xml);
            
            ///////XML query////

            var extractedData = "";
            var parser = new xml2js.Parser();
            parser.parseString(xml, function(err,result){
              //Extract the value from the data element
              extractedData = result['GetPasoParadaResult'];
              console.log(extractedData);
              if(typeof extractedData["PasoParada"] !== 'undefined')
              {
                console.log("Hay autobuses en direccion a esta parada.");
                extractedData["PasoParada"].forEach(element => { 
				  console.log("Elementito: ", element);
                  console.log("Elemento: ", element["PasoParada"]); 
                });
              } 
              else {
                console.log("No hay buses en direccion a esta parada.");
                response.say("No se esperan buses todavia en esta parada").shouldEndSession(false);
              }
            });
            //console.log("ExtractedData=", extractedData);
            ////////////
        }
        else
            console.log("Problemas con el servidor");
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
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