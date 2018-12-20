import React, { Component } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { perPage } from '../config';

import PaginationStyles from './styles/PaginationStyles';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

export default class Pagination extends Component {
  render() {
    return (
      <Query query={PAGINATION_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          const { count } = data.itemsConnection.aggregate;
          const pages = Math.ceil(count / perPage);
          const { page } = this.props;
          return (
            <PaginationStyles>
              <Head>
                <title>Sick Fits - Items (Page {page} of {pages})</title>
              </Head>
              {page > 1 && <Link prefetch href={{ pathname: '/items', query: { page: page - 1 } }}><a>Prev</a></Link>}
              <p>Page {page} of {pages}</p>
              <p>{count} items total</p>
              {page < pages && <Link prefetch href={{ pathname: '/items', query: { page: page + 1 } }}><a>Next</a></Link>}
            </PaginationStyles>
          );
        }}
      </Query>
    )
  }
}
