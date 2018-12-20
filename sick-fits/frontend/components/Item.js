import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import DeleteItem from './DeleteItem';

import formatMoney from '../lib/formatMoney';

export default class Item extends Component {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }).isRequired
  }

  render() {
    const { id, title, price, description, image } = this.props.item;
    return (
      <ItemStyles>
        {image && <img src={image} alt="title" />}
        <Title>
          <Link href={{ pathname: '/item', query: { id }}}>
            <a>{title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(price)}</PriceTag>
        <p>{description}</p>
        <div className="buttonList">
          <Link href={{
            pathname: '/update',
            query: { id }
          }}>
            <a>Edit</a>
          </Link>
          <button>Add To Cart</button>
          <DeleteItem id={id}>Delete Item</DeleteItem>
        </div>
      </ItemStyles>
    )
  }
}
