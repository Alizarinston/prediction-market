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

class ProposalDetail extends React.Component {

    constructor(props) {
    super(props);

    this.handler = this.handler.bind(this)
  }


    handler(e) {
        this.setState({
          id: e.target.id,
          descr: e.target.value
      });
    }

    state = {
        proposal: [],
        outcomes: ['null'],
        auth: [],
        wallet: []
    };

    componentDidMount() {
        const proposalID = this.props.match.params.proposalID;
        axios.get(`http://127.0.0.1:8000/api/auth/user/`, {headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${this.props.token}`
                }})
            .then(res => {
                this.setState({
                    auth: res.data,
                    wallet: res.data.wallet
                });
            });
        axios.get(`http://127.0.0.1:8000/api/markets/${proposalID}/`
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
                    descr: res.data.outcomes[0].description,
                    id: res.data.outcomes[0].id
                });
            }).catch(err => console.log("error " + err));
    }

    componentDidUpdate(prevProps) {
	    if (this.props !== prevProps)
	    {
	        axios.get(`http://127.0.0.1:8000/api/auth/user/`, {headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${this.props.token}`
                }})
            .then(res => {
                this.setState({
                    auth: res.data,
                    wallet: res.data.wallet
                });
            });
	        const proposalID = this.props.match.params.proposalID;
	        axios.get(`http://127.0.0.1:8000/api/markets/${proposalID}/`, {headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${this.props.token}`
                }})
            .then(res => {
                this.setState({
                    proposal: res.data,
                    outcomes: res.data.outcomes,
                    descr: res.data.outcomes[0].description,
                    id: res.data.outcomes[0].id
                });
            }).catch(err => console.log("error " + err));
	    }
	}

    render () {
        if (this.props.token == null) {
			// return <Redirect to="/login" />;
            return <Login/>
		}

        return (
            <div>
                <br/><br/><br/>
                <Grid columns={3}>
                    <Grid.Column floated={"left"}>
                        <Segment>

                            <Intro
                                outcome={this.state.id}/>

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
                                auth={this.state.auth.id}
                                userID={this.props.userID}
                                />

                        </Segment>

                        <Segment>

                        <OrderBook
                                outcome={this.state.id}
                                />

                        </Segment>

                    </Grid.Column>

                    <Grid.Column floated={"right"} width={4}>

                        <OutcomeList data={this.state.outcomes} handler={this.handler} wallet={this.state.wallet}/>

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
  };
};

// export default ProposalDetail;
export default connect(mapStateToProps)(ProposalDetail);
