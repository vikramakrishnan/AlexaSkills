'use strict';
var request = require('request');
var cnames = require ('countrynames');

var config = {
	endpoint : "http://www.geognos.com/api/en/countries/info/",
	type : '.json'
}

module.exports = {
	'capital' : function (country, callback) {
		var code = cnames.getCode(country);
		console.log(code);
		if(code === undefined) {
			callback(undefined);
		}
		request(config.endpoint + code + config.type, function (error, response, body) {
			console.log(body);
			if(response.statusCode != 200) {
				console.log({error,response});
			} else  {
				body = JSON.parse(body);
				callback (body.Results.Capital.Name);
			}
		});
	}
}