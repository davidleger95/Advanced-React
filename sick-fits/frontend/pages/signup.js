import Signup from '../components/Signup';
import Signin from '../components/Signin';
import styled from 'styled-components';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1.5rem;
`;

const SignupPage = ({ query }) => (
  <Columns>
    <Signup />
    <Signin />
  </Columns>
);

export default SignupPage;