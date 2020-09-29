import React from 'react';
import { withTaskContext } from '@twilio/flex-ui';


// This dummy url is a placeholder for sf-lookup function
const dummyFunctionURL = 'https://raw.githubusercontent.com/EncludeLtd/sf-flex/master/response.json';


class SFData extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: undefined,
      email: undefined,
    };

    // bind `this` so that it can be used from inside getCustomerData()
    this.getCustomerData = this.getCustomerData.bind(this);
  }

  componentDidMount() {
    this.getCustomerData();
  }

  // retrieve customer data using the Twilio function as a proxy to Salesforce
  getCustomerData() {

    if (this.props.task) {

      // Check that there is a selected task then you can call the real
      // sf lookup function passing in caller number but for
      // now use dummy function which returns canned but realistic data
      // Note as well that we'll eventually need to use a POST and provide
      // the users auth token

      // To get user token do this
      //const token = manager.store.getState().flex.session.ssoTokenPayload.token;

      // Create options for the post. Use token - get caller number from task attributes
      // then update the below to post to sf-lookup twilio function

      fetch(dummyFunctionURL)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            // throw an error if we received any error from the Function
            console.error('CRM fetch failed, response:', response);
            throw new Error('Failed to fetch from CRM');
          }
        })
        .then((data) => {
          // Pick out required data from the json returned from the function
          this.setState({
              name: data.records.Contact[0].Name,
              email: data.records.Contact[0].Email,
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
    const { name, email} = this.state;
    return (
      <div>
        <h2>Contact details</h2>
        <p>{name}</p>
        <p>{email}</p>
      </div>
    );
  }
}

export default withTaskContext(SFData);