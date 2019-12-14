import React from 'react';
import axios from 'axios';

import { Button, Form, Segment, Grid } from 'semantic-ui-react'
import connect from "react-redux/es/connect/connect";


class OrderForm extends React.Component {

    state = {
        auth: []
    };

    handleFormSubmit = (event, requestType, orderType) => {
        event.preventDefault();
        const amount = event.target.elements.quantity.value;
        // console.log(this.props.token);

        // axios.defaults.headers = {
        //     "Content-Type": "application/json",
        //     Authorization: `Token ${this.props.token}`
        // };
        // axios.get(`http://127.0.0.1:8000/api/auth/user/`)
        //     .then(res => {
        //         this.setState({
        //             auth: res.data,
        //         });
        //         console.log(this.state.auth.id)
        //     });

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
                              <label>Buy "{this.props.descr}"</label>
                              <input name="quantity" placeholder='Put a quantity here' />
                            </Form.Field>

                            <Button type="primary" htmltype="submit">{'Buy'}</Button>

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
                              <label>Sell "{this.props.descr}"</label>
                              <input name="quantity" placeholder='Put a quantity here' />
                            </Form.Field>

                            <Button type="primary" htmltype="submit">{'Sell'}</Button>

                          </Form>
                        </Segment>

                    </Grid.Column>
            </Grid>

        );
    }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token
  };
};

// export default OrderForm;
export default connect(mapStateToProps)(OrderForm);

