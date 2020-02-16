import React from 'react';
import axios from 'axios';

import { Button, Form, Segment, Grid } from 'semantic-ui-react'
import connect from "react-redux/es/connect/connect";


class OrderForm extends React.Component {

  handleFormSubmit = (event, requestType, orderType) => {
    event.preventDefault();
    const amount = event.target.elements.quantity.value;

    switch (requestType) {
      case 'post':
        // axios.defaults.headers = {
        //     "Content-Type": "application/json",
        //     Authorization: `Token ${this.props.token}`
        // };
        return axios.post('http://127.0.0.1:8000/api/orders/', {
          order_type: orderType,
          amount: amount,
          outcome: this.props.outcome,
          user: this.props.userID //this.state.auth.id
        }, {headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${this.props.token}`
          }})
          .then(res => console.log(res))
          .catch(error =>
            console.error(error.response));
    }

  };

  render() {
    return (
      <Grid columns={2} divided>
        <Grid.Column>

          <Segment>
            <Form onSubmit={(event) => this.handleFormSubmit(
              event,
              this.props.requestType,
              false)}>

              <Form.Field>
                <label>Купити "{this.props.descr}"</label>
                <input name="quantity" placeholder='Put a quantity here' />
              </Form.Field>

              <Button type="primary" htmltype="submit">{'Купити'}</Button>

            </Form>
          </Segment>

        </Grid.Column>

        <Grid.Column>

          <Segment>
            <Form onSubmit={(event) => this.handleFormSubmit(
              event,
              this.props.requestType,
              true)}>

              <Form.Field>
                <label>Продати "{this.props.descr}"</label>
                <input name="quantity" placeholder='Put a quantity here' />
              </Form.Field>

              <Button type="primary" htmltype="submit">{'Продати'}</Button>

            </Form>
          </Segment>

        </Grid.Column>
      </Grid>

    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    userID: state.auth.userID
  };
};

export default connect(mapStateToProps)(OrderForm);

