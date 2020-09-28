import styled from 'react-emotion';

export const CustomCRMContainer = styled('div')`
  padding: 20px;
  border: 5px solid red;
  background-color: ${(props) => props.theme.TaskCanvas.Container.background};
`;