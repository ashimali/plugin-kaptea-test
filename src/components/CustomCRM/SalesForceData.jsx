import React from 'react';
import { withTaskContext } from '@twilio/flex-ui';
import _ from 'lodash';


// TODO update do your function url
const copiaLookUpURL = "https://maize-turtle-3606.twil.io/copia-lookup";
const sfLookUpURL = "https://maize-turtle-3606.twil.io/sf-lookup";


class SFData extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: undefined,
      email: undefined,
      membershipType: undefined,
      externalId: undefined,
      chillStatus: undefined,
      bonusDonationType: undefined,
      affiliateRole: undefined,
      companyName: undefined,
      phone: undefined,
      baseUrl: undefined,
      accountUrl: undefined,
      companyCity: undefined,
      companyCountry: undefined,
      companyPostalCode: undefined,
      companyState: undefined,
      companyStreet: undefined,
    };

    // bind `this` so that it can be used from inside getCustomerData()
    this.getCustomerData = this.getCustomerData.bind(this);
  }

  componentDidMount() {
    this.getCustomerData();
  }

  // retrieve customer data using a Twilio function as a proxy to Salesforce
  getCustomerData() {
    const { task, manager} = this.props;

    if (task) {

      // Get the user's auth token to include in the request body for authentication
      const token = manager.store.getState().flex.session.ssoTokenPayload.token
      const phoneNumber = task.attributes.caller;

      // request body
      const body = {
        Token: token,
        phoneNumber: phoneNumber
      };

      // Set up the HTTP options for your request
      const options = {
        method: 'POST',
        body: new URLSearchParams(body),
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      };

      fetch(copiaLookUpURL, options)
        .then((response) => {
            return response.json();
        }).then((data) => {
           if(_.isEmpty(data)){
              console.log('Contact not fouund in copia', data);
              return fetch(sfLookUpURL, options).then((res) => {return res.json()});
           } else {
              return data;
           }
        }).then((data) => {
          // Pick out required data from the json returned from the function
          this.setState({
              name: data.name,
              email: data.email,
              membershipType: data.membershipType,
              externalId: data.externalId,
              chillStatus: data.chillStatus,
              bonusDonationType: data.bonusDonationType,
              affiliateRole: data.affiliateRole,
              companyName: data.companyName,
              phone: data.phone,
              baseUrl: data.baseUrl,
              accountUrl: data.accountUrl,
              companyCity: data.companyCity,
              companyCountry: data.companyCountry,
              companyPostalCode: data.companyPostalCode,
              companyState: data.companyState,
              companyStreet: data.companyStreet,
            });
        })
        .catch((error) => {
          // todo set state to error and render error message
          // if details could not be fetched
          console.error('CRM request failed', error);
        });
    }
  }

  render() {
    const { name, email, membershipType, externalId, chillStatus, bonusDonationType, affiliateRole, companyName, phone, baseUrl, accountUrl, companyCity, companyCountry, companyPostalCode, companyState, companyStreet} = this.state;
    return (
      <div>
        <h2>Contact details</h2>
        <p>{name}</p>
        <p>{email}</p>
        <p>{membershipType}</p>
        <p>{externalId}</p>
        <p>{chillStatus}</p>
        <p>{bonusDonationType}</p>
        <p>{affiliateRole}</p>
        <p>{companyName}</p>
        <p>{phone}</p>
        <p>{baseUrl}</p>
        <p>{accountUrl}</p>
        <p>{companyCity}</p>
        <p>{companyCountry}</p>
        <p>{companyPostalCode}</p>
        <p>{companyState}</p>
        <p>{companyStreet}</p>
      </div>
    );
  }
}

export default withTaskContext(SFData);