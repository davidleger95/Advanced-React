import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';

import Error from './ErrorMessage';
import { log } from 'async';

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) { id title description price }
  }
`;

export default class UpdateItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  state = {}

  onChange = e => {
    const { name, type, value } = e.target;
    this.setState({ [name]: type === 'number' ? parsetFloat(value) : value });
  }

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log(this.state)
    const res = await updateItemMutation({
      variables: { id: this.props.id, ...this.state }
    });
    console.log(res);
  }

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>No item found for ID {this.props.id}</p>
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
                        onChange={this.onChange}
                        />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="$"
                        required
                        defaultValue={data.item.price}
                        onChange={this.onChange}
                        />
                    </label>
                    <label htmlFor="title">
                    Description
                      <textarea
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Description"
                        required
                        defaultValue={data.item.description}
                        onChange={this.onChange}
                        />
                    </label>
                    <input type="submit" value="Save Changes" />
                  </fieldset>
                  {error && <Error error={error} />}
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    )
  }
}
