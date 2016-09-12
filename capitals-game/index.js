'use strict';
var Alexa = require('alexa-sdk');
var utils = require('./utils.js');
var countries = require('./countries.js');

var APP_ID = "arn:aws:lambda:us-east-1:413904492358:function:myCapitalsGameFunc";
var SKILL_NAME = 'Capitals Fun';

exports.handler = function(event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.APP_ID = APP_ID;
	alexa.registerHandlers(defaultHandlers, initStateHandlers, playStateHandlers);
	alexa.execute();
};

var GAME_STATES = {
	INIT: '_INITMODE',
	PLAY: '_PLAYMODE'
};

var defaultHandlers = {
	// Game Starts here...
	'NewSession': function() {
		if (Object.keys(this.attributes).length === 0) { // Check if it's the first time the skill has been invoked
			this.attributes['answered'] = false;
			this.attributes['country'] = '';
			this.attributes['question'] = '';
			this.attributes['totalqs'] = 0;
		}
		this.emit('AMAZON.HelpIntent');
	},

	'AMAZON.HelpIntent': function() {
		var speechOutput = "You can say 'play', to start a game, where i will ask you the capital of a list of countries, try to get \
        as many as you can correctly. \
        or you can say 'stop',  to finish the game. You can also ask me for the capital of any country, and i'll find that for you. \
        Now, what can i help you with?";
		var reprompt = "What can I help you with";
		this.emit(':ask', speechOutput, reprompt);
	},

	'WhatsTheCapitalIntent': function() {
		var self = this;
		var country = this.event.request.intent.slots.country.value;
		utils.capital(country, function(capital) {
			var speechOutput = '';
			if ((capital === undefined) || (capital === null)) {
				speechOutput = "I didn't recognize the name of the country, please say that again";
				var reprompt = 'What was the country again?';
				self.emit(':ask', speechOutput, reprompt);
			} else {
				speechOutput = 'The capital of ' + country + ' is ' + capital;
				self.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);
			}

		});
	},

	'AMAZON.CancelIntent': function() {
		this.emit('AMAZON.StopIntent');
	},

	'AMAZON.StopIntent': function() {
		this.emit(':tell', 'Goodbye!!');
	},

	'PlayCapitalTriviaIntent': function() {
		// Get into the play mode.
		this.handler.state = GAME_STATES.INIT;
		this.attributes['country'] = '';
		this.attributes['question'] = '';
		this.attributes['totalqs'] = 0;
		this.attributes['answered'] = 0;
		this.emitWithState('StartGame');
	}
};

var initStateHandlers = Alexa.CreateStateHandler(GAME_STATES.INIT, {
	'StartGame': function() {
		this.attributes['answered'] = 0;
		// Start play state by asking the first question and changing the states.
		this.handler.state = GAME_STATES.PLAY;
		var index = Math.floor(Math.random() * countries.names.length);
		var speechOutput = "what is the capital of " + countries.names[index].name + "?.";
		this.attributes['country'] = countries.names[index].name;
		this.attributes['question'] = speechOutput;
		this.attributes['totalqs'] = this.attributes['totalqs'] + 1;
		this.emit(":ask", speechOutput, speechOutput);
	}
});

var playStateHandlers = Alexa.CreateStateHandler(GAME_STATES.PLAY, {
	'AMAZON.StartOverIntent': function() {
		this.handler.state = GAME_STATES.INIT;
		this.emitWithState('StartGame');
	},
	'AMAZON.RepeatIntent': function() {
		this.emit(':ask', this.attributes['question'], this.attributes['question']);
	},
	'AMAZON.HelpIntent': function() {
		var speechOutput = "I will ask you capitals for a set of countries. Respond with an answer. \
    	You get 1 point for every correct answer. Do you want to continue playing?. \
    	To repeat the last question, say 'repeat'. You can also say, 'stop' to quit.";
		var reprompt = "To repeat the last question, say 'repeat'. or say, 'stop' to quit.";

		this.emit(':tell', speechOutput, reprompt);
	},
	'AMAZON.StopIntent': function() {
		var speechOutput = 'Thanks for Playing. You have correctly answered ' + this.attributes['answered'] +
			' out of ' + this.attributes['totalqs'] + ' questions; Goodbye!!';
		this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);
	},
	'DontKnowIntent': function() {
		handleAnswers.call(this, true);
	},
	'AnswerIntent': function() {
		handleAnswers.call(this, false);
	},
	'Unhandled': function() {
		this.emit('AMAZON.RepeatIntent');
	}
});


function handleAnswers(userGaveUp) {
	var speechOutput = ' ';
	utils.capital(this.attributes['country'], function(capital) {
		if ((capital === undefined) || (capital === null)) {
			console.log(this.attributes['country']);
			this.emit('AMAZON.StopIntent');
		} else {
			console.log('capital is ' + capital);
			if (!userGaveUp) {
				var givenAnswer = this.event.request.intent.slots.capital.value;
				if (givenAnswer == capital) {
					speechOutput = 'Correct: ';
					this.attributes['answered'] = this.attributes['answered'] + 1;
				} else {
					speechOutput = givenAnswer + " is Wrong: Capital of " + this.attributes['country'] + " is " + capital;
				}
			} else {
				speechOutput = "Capital of " + this.attributes['country'] + " is " + capital;
			}
			var index = Math.floor(Math.random() * countries.names.length);
			speechOutput += "; what is the capital of " + countries.names[index].name + "?.";
			this.attributes['country'] = countries.names[index].name;
			this.attributes['question'] = speechOutput;
			this.attributes['totalqs'] = this.attributes['totalqs'] + 1;
			//this.emit(":ask", speechOutput, speechOutput);
			this.emit(":askWithCard", speechOutput, speechOutput,SKILL_NAME,speechOutput);
		}
	}.bind(this));
}