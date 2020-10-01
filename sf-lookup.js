var querystring = require('querystring');
var request = require('request');
var get = require('lodash/get');

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
                response.setBody(buildResponseData(JSON.parse(body));
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

    function buildContact(rawData) {
        let contact = {
            baseUrl: get(rawData, 'baseUrl', null),

            name: get(rawData, 'records.Contact[0].Name', null),
            email: get(rawData, 'records.Contact[0].Email', null),
            phone: get(rawData, 'records.Contact[0].Phone', null),
            affiliateRole: get(rawData, 'records.Contact[0].Prmary_Affiliation_Role__c', null),

            membershipType: get(rawData, 'records.Account[0].Membership_Type__c', null),
            externalId: get(rawData, 'records.Account[0].Extenal_Id__c', null),
            chillStatus: get(rawData, 'records.Account[0].Accpt_Chill__c', null),
            bonusDonationType : get(rawData, 'records.Account[0].Bonus_Donation_Type__c', null) ,
            companyName: get(rawData, 'records.Account[0].Name', null),
            accountUrl: get(rawData, 'records.Account[0].attributes.url', null),
            companyCity: get(rawData, 'records.Account[0].BillingAddress.city', null),
            companyCountry: get(rawData, 'records.Account[0].BillingAddress.country', null),
            companyPostalCode: get(rawData, 'records.Account[0].BillingAddress.postalCode', null),
            companyState: get(rawData, 'records.Account[0].BillingAddress.state', null),
            companyStreet: get(rawData, 'records.Account[0].BillingAddress.street', null),

        }
        return contact;
    }
});