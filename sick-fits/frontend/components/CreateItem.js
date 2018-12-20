import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';

import Error from './ErrorMessage';
import { log } from 'async';

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $image: String
    $largeImage: String
    $price: Int!
  ) {
    createItem(
      title: $title
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
    ) { id }
  }
`;

export default class CreateItem extends Component {
  state = {
    title: 'Pellentesque Risus Ornare',
    description: 'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.',
    image: 'image.jpg',
    largeImage: 'large-image.jpg',
    price: 1000
  }

  onChange = e => {
    const { name, type, value } = e.target;
    this.setState({ [name]: type === 'number' ? parsetFloat(value) : value });
  }

  uploadFile = async e => {
    const { files } = e.target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const res = await fetch('https://api.cloudinary.com/v1_1/dleger/image/upload', {
      method: 'POST',
      body: data
    });

    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={async e => {
            e.preventDefault();
            // Call create item mutation
            const res = await createItem();
            // change route to item page
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id }
            })
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an Image"
                  required
                  onChange={this.uploadFile}
                />
                {this.state.image && <img style={{ maxWidth: 200, maxHeight: 200 }} src={this.state.image} alt="" />}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={this.state.title}
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
                  value={this.state.price}
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
                  value={this.state.description}
                  onChange={this.onChange}
                  />
              </label>
              <input type="submit" value="Submit" />
            </fieldset>
            {error && <Error error={error} />}
          </Form>
        )}
      </Mutation>
    )
  }
}
