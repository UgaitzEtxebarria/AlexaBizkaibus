module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'alexa-skill-bizkaibus' );


app.launch( function( request, response ) {
	response.say( 'Bienvenido a la skill de Bizkaibus' ).reprompt( 'Way to go. You got it to run. Bad ass.' ).shouldEndSession( false );
} );


app.error = function( exception, request, response ) {
	console.log(exception)
	console.log(request);
	console.log(response);	
	response.say( 'Sorry an error occured ' + error.message);
};

app.intent('proximo_autobus',
  {
    //"slots":{"number":"NUMBER"},
	"utterances":[ 
		"Cuando llega el siguiente autobus",
		"Cual es el siguiente bus",
		"El proximo bus"]
  },
  function(request,response) {
    //var number = request.slot('number');
    response.say("No me han programado para entender eso, lo siendo");
  }
);

module.exports = app;