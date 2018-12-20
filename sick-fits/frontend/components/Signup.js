import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      name, email, id
    }
  }
`;

export default class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: ''
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    const { email, name, password, } = this.state;
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signup, { error, loading }) => {
          return (
            <Form method="post" onSubmit={async e => {
              e.preventDefault();
              const res = await signup();
              this.setState({ name: '', email: '', password: '' });
              }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign up for an account!</h2>
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
                <label htmlFor="name">
                  Name
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    value={name}
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
                <input type="submit" value="Sign Up!" />
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    )
  }
}
