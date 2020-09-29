import React from 'react';
import { withTaskContext } from '@twilio/flex-ui';
import { CustomCRMContainer } from './CustomCRM.Styles';
import SFData from './SalesForceData';

function CustomCRM(props) {
  const { task, manager} = props;

  // build the CRM content based on whether a Task is selected
  let content;
  if (!task) {
    // no task is selected
    content = (
      <div>
        <p>Custom CRM</p>
        <p>No task selected</p>
      </div>
    );
  } else {
      content = (
        <div>
          <p>Custom CRM</p>
          <SFData manager={manager}/>
        </div>
    );
  }

  return <CustomCRMContainer>{content}</CustomCRMContainer>;
}

export default withTaskContext(CustomCRM);