
module.change_code = 1;
'use strict';

const http = require('http');
var xml2js = require('xml2js');
var alexa = require('alexa-app');
var app = new alexa.app('alexa-skill-bizkaibus');

function zeroPad(num) {
  return String(num).padStart(4, '0')
}

/////Functions/////

function getAPI(request, response) {
	try {
		
		var stopId = request.slot('number');
		var url = "";
		var lineId = "A3642";
		var respuesta = "Sin respuesta";
		console.log("Numero de parada: ", stopId);
		if(typeof stopId === 'undefined' || stopId === null) //For testing
		{
			stopId = parseInt("0270", 10);
			console.log("Numero de parada cambiado: " + stopId);
		}
	  
		url = 'http://apli.bizkaia.net/APPS/DANOK/TQWS/TQ.ASMX/GetPasoParadaMobile_JSON?callback=%22%22&strLinea=' + lineId + '&strParada=' + zeroPad(stopId);
		console.log("URL: ", url);


		return new Promise(function(resolve, reject) {
			 // Do async job
			 console.log("URL2: ", url);
			 
			http.get(url, (resp) => {
				let data = '';

				  // A chunk of data has been recieved.
				  resp.on('data', (chunk) => {
					data += chunk;
				  });

				  // The whole response has been received. Print out the result.
				  resp.on('end', () => {
					console.log("A procesar: ");
					console.log(data);
					
					data = data.replace("\"\"(","").replace(");","").replace(new RegExp("'", 'g'),"\"");

					//console.log("Cleaned: ", body);
					var JSONResponse = JSON.parse(data);
					//console.log("JSON: ", JSONResponse);

					if (JSONResponse["STATUS"] == "OK")
						resolve(JSONResponse["Resultado"], lineId, stopId);
					else
						reject("No esta disponible");
				  });

				}).on("error", (err) => {
				  console.log("Error: " + err.message);
				  reject(err.message);
				});
		})
	//response.say(respuesta).shouldEndSession(false);
    //response.say("Cuando llegue!");
  	}
	catch(e){
		console.log("Error captado procesar la llamada a la API: " + e);
	}
  }

function processBody(xml, lineId, stopId){
	try{
		console.log("Processing body");
        
		/*var xml  = JSONResponse["Resultado"];*/
		console.log("resultado: ", xml);
		
		///////XML query////

		var extractedData = "";
		
		var parser = new xml2js.Parser();
		parser.parseString(xml, function(err,result){
		  //Extract the value from the data element
		  extractedData = result['GetPasoParadaResult'];
		  //console.log(extractedData);
		  if(typeof extractedData["PasoParada"] !== 'undefined')
		  {
			var found = false;
			console.log("Hay autobuses en direccion a esta parada.");
			
			extractedData["PasoParada"].forEach(element => { 
			  //console.log("Elemento: ", element);
			  console.log("Linea: " + element["linea"] + " - " + lineId);
			  if(element["linea"] == lineId)
			  {
				console.log("Linea " + lineId + " encontrada."); 
				found = true;
				var minutos = element["e1"][0]["minutos"];
				console.log("Tiempos: " + minutos);
				respuesta = "La linea " + lineId + " llega a la parada " + stopId + " en " + minutos +  " minutos.";
				console.log("Respuesta: " + respuesta);
				//response.say(respuesta).shouldEndSession(true);
			  }
			});
			
			if(!found)
			{
				console.log("No se encuentra la linea " + lineId + ".");
				respuesta = "La linea " + lineId + " no se encuentra en esta parada.";
			}
				
		  } 
		  else {
			console.log("No hay buses en direccion a esta parada.");
			respuesta = "No se esperan buses todavia en esta parada";
		  }
		});
		
		return respuesta;
		////////////
	}
	catch(e){
		console.log("Error captado al llamar a la API: " + e);
		return "Error al procesar la informacion";
	}
  }
  
////////////////

app.launch(function (request, response) {
  response.say('Bienvenido a la skill de Bizkaibus').reprompt('Way to go. You got it to run. Bad ass.').shouldEndSession(false);
});

app.error = function (exception, request, response) {
  console.log("Exception : ");
  console.log(exception);
  console.log("Request : ");
  console.log(request);
  console.log("Response : ");
  console.log(response);
  response.say('Ha ocurrido un error con la informacion deseada.');
};

app.intent('proximo_autobus',
  {
    "slots":{"number": "AMAZON.NUMBER"},
    "utterances": [
      "Cuando llega el siguiente autobus a la parada {-|number}",
      "Cual es el siguiente bus en {-|number}",
      "El proximo bus en {-|number}"]
  },
  function(request, response) {
	getAPI(request, response)
	.then((xml, lineId, stopId) => {
	  response.say("Tengo datos").shouldEndSession(false);
      console.log("OK!: ");
	  console.log(xml);
	  console.log(lineId);
	  console.log(stopId);
	  var definitivo = processBody(xml, lineId, stopId);
	  console.log("Respuesta definitiva: ");
	  console.log(definitivo);
	  response.say(definitivo).shouldEndSession(false);
    })
	.catch(err => {
      console.error("Fatal Error: ");
	  console.error(err);
	  response.say(err);
    })
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
