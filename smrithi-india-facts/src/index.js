'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = "arn:aws:lambda:us-east-1:413904492358:function:myFactSkill";
var SKILL_NAME = 'Smrithi - India Facts';

/**
 * Array containing space facts.
 */
var FACTS = [
    "Population of India is 1.3 Billion. It's the second largest in the world.",
    "Rabindra Nath Tagore wrote the Indian National Anthem - Jana  Gana  Mana",
    "India got independence from United Kindom on 15th of August 1947, a Friday.",
    "Dr. Rajendra Prasad was the first President of India",
    "Jawaharlal Nehru was the first Prime Minister of India",
    "Mango is the National Fruit of India",
    "Lotus is the National Flower of India",
    "Ganga, is the National River of India",
    "Banyan tree, is India's National Tree",
    "India has a total of 29 states and 7 union territories.",
    "In terms of Size, Rajasthan is the largest state and  Goa is the smallest state in India.",
    "In terms of Population, Uttar Pradesh is the most populous state and Sikkiim is the least populous state in India",
    "India is the birthplace of chess. The original word for “chess” is the Sanskrit 'chaturanga', meaning 'four members of an army' — which were mostly likely elephants, horses, chariots, and foot soldiers",
    "The capital city is New Delhi, while the most populated city is Mumbai. Other major cities include Kolkata, Chennai and Bangalore.",
    "The highest mountain in India is Kanchenjunga, standing at 8,598m (28,209 ft), which it shares with Nepal. Kanchenjunga is the third highest mountain in the world.",
    "India is the seventh largest country by total area.",
    "The national symbol of India is the endangered Bengal Tiger.",
    "India does not have a National Language. Hindi and English are the most used official Languages in India",
    "Children's Day is celebrated in India on November 14th, 9 months after Valentine's Day.",
    "India has the world’s third largest active army, after China and USA",
    "The Tirupati Balaji temple and the Kashi Vishwanath Temple, both, receive more visitors than the Vatican City and Mecca combined",
    "Every 12 years, a religious gathering called the Kumbh Mela occurs in India. It is the world’s largest gathering of people. The gathering is so large that the Kumbh Mela is visible from the space",
    "India has more mosques than any other nation in the world. It also has the world's 3rd largest muslim population.",
    "Until 1986, the only place where diamonds had been officially found was in India",
    "India is the largest producer of films in the world",
    "India is the largest milk producer in the world",
    "India is one of the only three countries that makes supercomputers (the US and Japan are the other two)",
    "The world’s largest road network is in India—over 1.9 million miles of roads cover the country.",
    "The state of meghalaya in India, recieves world’s largest amount of rain",
    "Algebra, Trigonometry and Calculus are studies, which originated in India.",
    "The World's First Granite Temple is the Brihadeshwara Temple at Tanjavour, Tamil Nadu. The shikhara of the temple is made from a single 80-tonne piece of granite. This magnificent temple was built in just five years, (between 1004 AD and 1009 AD) during the reign of Rajaraja sholah.",
    "Until 1896, India was the only source of diamonds in the world ",
    "The value of 'pi' was first calculated by the Indian Mathematician Budhayana, and he explained the concept of what is known as the Pythagorean Theorem. He discovered this in the 6th century, long before the European mathematicians.",
    "The Baily Bridge is the highest bridge in the world. It is located in the Ladakh valley between the Dras and Suru rivers in the Himalayan mountains. It was built by the Indian Army in August 1982."
];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('AMAZON.HelpIntent');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random space fact from the space facts list
        var factIndex = Math.floor(Math.random() * FACTS.length);
        var randomFact = FACTS[factIndex];

        // Create speech output
        var speechOutput = " " + randomFact;

        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say tell me a fact about India, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with Smrithi?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Bye Smrithi!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye Smrithi!');
    }
};