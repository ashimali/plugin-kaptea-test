var querystring = require('querystring');
var request = require('request');
const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator(function(context, event, callback) {

    const phoneNumber = event.phoneNumber;
    const userDataURL = "https://raw.githubusercontent.com/EncludeLtd/sf-flex/master/response.json";

    //================================================================================
    // Build Response
    //================================================================================
    // Set the CORS headers to allow Flex to make an HTTP request to the Twilio Function
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.appendHeader('Content-Type', 'application/json');

    console.log('Get user data for:', phoneNumber);

    getData();

    function getData() {
        request({
            uri: userDataURL,
            method: 'GET'
        }, function(err, res, body) {
            if (res.statusCode == 200) {
                response.setBody(JSON.parse(body));
                return callback(null, response);
            } else {
                handleError(err, res, body);
            }
        });
    }

    function handleError(err, res, body) {
        var statusCode = res.statusCode || 500;
        response.setStatusCode(statusCode);
        response.setBody(err || body);
        return callback(null, response);
    }

});