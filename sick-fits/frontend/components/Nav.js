import React, { Component } from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

class Nav extends Component {
  render() {
    return (
      <User>
        {({ data }) => (
          <NavStyles>
            <Link href="/items">
              <a>Shop</a>
            </Link>
            {data.me ? (
              <>
                <Link href="/sell">
                  <a>Sell</a>
                </Link>
                <Link href="/orders">
                  <a>Orders</a>
                </Link>
                <Link href="/me">
                  <a>Account</a>
                </Link>
                <Signout />
              </>
            ) : (
              <>
                <Link href="/signup">
                  <a>Sign In</a>
                </Link>
              </>
            )}
          </NavStyles>
        )}
      </User>
    );
  }
}

export default Nav;
