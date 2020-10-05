const request = require('request-promise');
const qs = require('querystring');
const _ = require('lodash');

// TODO wrap with TokenValidator

exports.handler = function(context, event, callback) {

   const response = new Twilio.Response();
   response.appendHeader('Access-Control-Allow-Origin', '*');
   response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
   response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
   response.appendHeader('Content-Type', 'application/json');

   const contactUrl = 'https://raw.githubusercontent.com/ashimali/plugin-kaptea-test/master/data/contact.json';
   const charityUrl = 'https://raw.githubusercontent.com/ashimali/plugin-kaptea-test/master/data/charity.json';
   const donorUrl = 'https://raw.githubusercontent.com/ashimali/plugin-kaptea-test/master/data/donor.json';

   const contactPhoneNumber = event.contactPhoneNumber

   // TODO in real system the GET methods need authentication - check with Copia for authentication
   // method

   function getContact() {
       console.log('Try contact api for', contactPhoneNumber)
       return request({
           method: 'GET',
           uri: contactUrl,
           qs: {data : contactPhoneNumber},
           json: true
        });
   }

   function getCharity(res) {

       // TODO the res param here may have an externalId
       // if there is no contact in the return data, i.e. empty json
       // don't make request just return empty json)

      console.log('Check charity API for', res);

      if (_.isEmpty(res)) {
        console.log('No contact found', res);
        return res;
      } else {
        const externalId = res.externalId
        return request({
           method: 'GET',
           uri: charityUrl,
           qs: {externalId : externalId},
           json: true
        });
      }
   }

   function getDonor(res) {
      if (_.has(res, 'externalId')) {
        console.log('No need to check donor API', res);
        return res;
      } else {
        console.log('No org details so check donor API', res);
        const url = donorUrl;
        const externalId = res.externalId
        return request({
           method: 'GET',
           uri: donorUrl,
           qs: {externalId : externalId},
           json: true
        });
      }
   }

   function returnResponse(res) {

        // TODO - marshall json data into json object that
        // matches what UI expects

        console.log('Data found', res);
        response.setBody(res)
        return callback(null, response);
   }

   function returnEmpty() {
       response.setBody({})
       return callback(null, response);
   }

   return getContact().then(getCharity).then(getDonor).then(returnResponse).catch(returnEmpty);

};