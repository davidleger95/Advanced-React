import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      name, email, id
    }
  }
`;

export default class Signin extends Component {
  state = {
    email: '',
    password: ''
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    const { email, password, } = this.state;
    return (
      <Mutation mutation={SIGNIN_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signin, { error, loading }) => {
          return (
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              const res = await signin();
              this.setState({ email: '', password: '' });
              }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign in to your account!</h2>
                <Error error={error} />
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={this.onChange}
                    required
                  />
                </label>
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="********"
                    value={password}
                    onChange={this.onChange}
                    required
                  />
                </label>
                <input type="submit" value="Sign In!" />
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    )
  }
}
