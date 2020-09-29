import React from 'react';
import { withTaskContext } from '@twilio/flex-ui';


// TODO update do your function url
const sfLookUpURL = "https://maize-turtle-3606.twil.io/sf-lookup";


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

  // retrieve customer data using a Twilio function as a proxy to Salesforce
  getCustomerData() {
    const { task, manager} = this.props;

    if (task) {

      // Get the user's auth token to include in the request body for authentication
      const token = manager.store.getState().flex.session.ssoTokenPayload.token
      const phoneNumber = this.props.task.caller

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

      fetch(sfLookUpURL, options)
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