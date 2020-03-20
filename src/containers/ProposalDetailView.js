import React from 'react';
import axios from 'axios';

import { Card } from 'antd';
import {Grid, Image, Segment, Button, Progress, Label, Container} from 'semantic-ui-react'
import Intro from './chart/intro';
import OrderBook from './OrderBook/OrderBookHistory'
import OrderForm from '../components/OrderForm';
import OutcomeList from './OutcomeListView';
import connect from "react-redux/es/connect/connect";
// import { Redirect } from "react-router-dom";
import Login from './Login';
import PublicWebSocketInstance from "../websocket_anon";
import { HOST_URL } from '../settings';


class ProposalDetail extends React.Component {

  // initialiseChat() {
  //   const proposalID = this.props.match.params.marketID;
  //   this.waitForSocketConnection(() => {
  //     PublicWebSocketInstance.newChannel(
  //       proposalID
  //     );
  //   });
  //   PublicWebSocketInstance.connect();
  // }

  constructor(props) {
    super(props);

    // this.initialiseChat();
    PublicWebSocketInstance.addCallbacks(this.setMessages.bind(this));

    this.handler = this.handler.bind(this)
  }

  // waitForSocketConnection(callback) {
  //   const component = this;
  //   setTimeout(function() {
  //     if (PublicWebSocketInstance.state() === 1) {
  //       console.log("Connection is made");
  //       callback();
  //       return;
  //     } else {
  //       console.log("wait for connection...");
  //       component.waitForSocketConnection(callback);
  //     }
  //   }, 100);
  // }

  setMessages(data, orders) {
    if (this.state.id === undefined || this.state.descr === undefined) {
      this.setState({
        descr: data.outcomes[0].description,
        id: data.outcomes[0].id
      })
    }
    this.setState({
      proposal: data,
      outcomes: data.outcomes,
      orders: orders
    });
  }

  handler(id, value) {
    this.setState({
      id: id,
      descr: value
    });
  }

  state = {
    proposal: [],
    outcomes: ['null'],
    orders: []
  };

  test() {
    // if (this.state.id)
    // const proposalID = this.props.match.params.proposalID;

    const proposalID = this.props.match.params.marketID;
    // axios.get(`http://127.0.0.1:8000/api/auth/user/`, {headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Token ${this.props.token}`
    //     }})
    // .then(res => {
    //     this.setState({
    //         auth: res.data,
    //         wallet: res.data.wallet
    //     });
    // });

    axios.get(`${HOST_URL}/api/markets/${proposalID}/`
      , {headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.props.token}`
        }}
    )
      .then(res => {
        // if (!res.data.proposal) {
        //     res.data = []
        //     // тут нужно вызвать ошибку, there is no such proposal
        // }
        this.setState({
          proposal: res.data,
          outcomes: res.data.outcomes,
          // descr: res.data.outcomes[0].description,
          // id: res.data.outcomes[0].id
        });

        if (this.state.id === undefined || this.state.descr === undefined) {
          this.setState({
            descr: res.data.outcomes[0].description,
            id: res.data.outcomes[0].id
          })
        }
      }).catch(err => console.log("error " + err));
  }

  componentDidMount() {
    const proposalID = this.props.match.params.marketID;
    PublicWebSocketInstance.connect(proposalID);
    // PublicWebSocketInstance.newChannel(proposalID);

    // const proposalID = this.props.match.params.proposalID;
    // axios.get(`http://127.0.0.1:8000/api/markets/${proposalID}/`
    //     , {headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Token ${this.props.token}`
    //         }}
    //         )
    //     .then(res => {
    //         // if (!res.data.proposal) {
    //         //     res.data = []
    //         //     // тут нужно вызвать ошибку, there is no such proposal
    //         // }
    //         this.setState({
    //             proposal: res.data,
    //             outcomes: res.data.outcomes,
    //             descr: res.data.outcomes[0].description,
    //             id: res.data.outcomes[0].id
    //         });
    //     }).catch(err => console.log("error " + err));

    if (this.props.token) {

      // this.test();
      // this.timer = setInterval(() => this.test(), 500);
    }
  }

  componentWillUnmount() {
    // this.timer = null;
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps)
    {
      // const proposalID = this.props.match.params.proposalID;
      // axios.get(`http://127.0.0.1:8000/api/markets/${proposalID}/`, {headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Token ${this.props.token}`
      //     }})
      // .then(res => {
      //     this.setState({
      //         proposal: res.data,
      //         outcomes: res.data.outcomes,
      //         descr: res.data.outcomes[0].description,
      //         id: res.data.outcomes[0].id
      //     });
      // }).catch(err => console.log("error " + err));
      if (this.props.token) {
        // this.test();
        // this.timer = setInterval(() => this.test(), 500);
      }

      // if (this.props.token) {
      //     this.timer = setInterval(() => this.test(), 500);
      // }
    }
  }

  render () {
    // WebSocketInstance.connect(this.props.token, this.props.userID);
    // if (this.props.token == null) {
    // 	// return <Redirect to="/login" />;
    //     return <Login/>
    // }

    return (
      <div>
        <br/><br/><br/>
        <Grid columns={3}>
          <Grid.Column floated={"left"}>
            <Segment>

              <Intro
                outcome={this.state.id}
              />

            </Segment>

          </Grid.Column>

          <Grid.Column stretched width={6}>
            <Segment>

              <Card title={`${this.state.proposal.name}?`}>
                <p/>
                <p>{this.state.proposal.description}</p>
              </Card>

            </Segment>
            <Segment>

              <OrderForm
                requestType="post"
                outcome={this.state.id}
                descr={this.state.descr}
                userID={this.props.userID}
              />

            </Segment>

            <Segment>

              <OrderBook
                outcome={this.state.id} orders={this.state.orders}
              />

            </Segment>

          </Grid.Column>

          <Grid.Column floated={"right"} width={4}>

            <OutcomeList data={this.state.outcomes} handler={this.handler} wallet={this.props.wallet}/>

          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    userID: state.auth.userID,
    wallet: state.auth.wallet,
  };
};

export default connect(mapStateToProps)(ProposalDetail);
