import React from 'react';
import axios from 'axios';

import { Card } from 'antd';
import { Grid, Image, Rail, Segment } from 'semantic-ui-react'


class ProposalDetail extends React.Component {

    state = {
        proposal: {}
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
                    proposal: res.data
                });
            })
    }

    render () {
        return (
            <Grid centered columns={3}>
                <Grid.Column>
                    <Segment>
                        <Image src='/images/wireframe/paragraph.png' />

                        <Rail dividing position='left'>
                            <Segment>Left Rail Content</Segment>
                        </Rail>

                        <Card title={this.state.proposal.name}>
                            <p>{this.state.proposal.description}</p>
                            <p>Supply: {this.state.proposal.supply} Cash</p>
                        </Card>

                        <Rail dividing position='right'>
                            <Segment>Right Rail Content</Segment>
                        </Rail>
                    </Segment>
                </Grid.Column>
            </Grid>
            // <Card title={this.state.proposal.name}>
            //     <p>{this.state.proposal.description}</p>
            //     <p>Supply: {this.state.proposal.supply} Cash</p>
            // </Card>
        )
    }
}

export default ProposalDetail;