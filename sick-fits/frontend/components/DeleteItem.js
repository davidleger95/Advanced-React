import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
      title
    }
  }
`;

export default class DeleteItem extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired
  }

  update = (cache, payload) => {
    console.log({ payload });

    // update the cache on client so it matches the server
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }

  render() {
    const { id, children } = this.props;
    return (
      <Mutation mutation={DELETE_ITEM_MUTATION} variables={{ id }} update={this.update}>
        {(deleteItem, { data, loading, error }) => (
          <button onClick={() => confirm('Are you sure you want to delete this item?') && deleteItem(id)} disabled={loading} aria-busy={loading}>
            {children}
          </button>
        )}
      </Mutation>
    );
  }
}
