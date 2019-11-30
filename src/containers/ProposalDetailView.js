import React from 'react';
import axios from 'axios';

import { Card } from 'antd';
import {Grid, Image, Segment, Button, Progress, Label, Container} from 'semantic-ui-react'
import Intro from './chart/intro';
import OrderBook from './OrderBook/OrderBookHistory'
import OrderForm from '../components/OrderForm';
import OutcomeList from './OutcomeListView';

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
        outcomes: ['null']
    };

    componentDidMount() {
        const proposalID = this.props.match.params.proposalID;
        axios.get(`http://127.0.0.1:8000/api/markets/${proposalID}/`)
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
            })
    }

    render () {
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
                                />

                        </Segment>

                        <Segment>

                        <OrderBook
                                outcome={this.state.id}/>

                        </Segment>

                    </Grid.Column>

                    <Grid.Column floated={"right"} width={4}>

                        <OutcomeList data={this.state.outcomes} handler = {this.handler}/>

                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default ProposalDetail;