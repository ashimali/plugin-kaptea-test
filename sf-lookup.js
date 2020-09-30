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
            name: null,
            email: null,
            membershipType: null,
            externalId: null,
            chillStatus: null,
            bonusDonationType : null ,
            affiliateRole: null,
            companyName: null,
            phone: null,
            baseUrl: rawData.baseUrl,
            accountUrl: null,
            companyCity: null,
            companyCountry: null,
            companyPostalCode: null,
            companyState: null,
            companyStreet: null,
        };
        if (!rawData.records) {
            return contact;
        }
        if (rawData.records.Contact && rawData.records.Contact[0]) {
            let contactDetails = rawData.records.Contact[0];
            contact.name = contactDetails.Name
            contact.email = contactDetails.Email;
            contact.affiliateRole = contactDetails.Prmary_Affiliation_Role__c;
            contact.phone = contactDetails.Phone;
        }
        if (rawData.records.Account && rawData.records.Account[0]) {
            let account = rawData.records.Account[0];
            contact.membershipType = account.Membership_Type__c;
            contact.externalId = account.Extenal_Id__c;
            contact.chillStatus = account.Accpt_Chill__c;
            contact.bonusDonationType = account.Bonus_Donation_Type__c;
            contact.companyName = account.Name;

            if (rawData.records.Account[0].attributes) {
                contact.accountUrl = rawData.records.Account[0].attributes.url;
            }
            if (rawData.records.Account[0].BillingAddress) {
                let billing = rawData.records.Account[0].BillingAddress;
                contact.companyCity = billing.city;
                contact.companyCountry = billing.country;
                contact.companyPostalCode = billing.postalCode;
                contact.companyState = billing.state;
                contact.companyStreet = billing.street;
        }
        return contact;
    }
});