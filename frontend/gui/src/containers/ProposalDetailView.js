import React from 'react';
import axios from 'axios';

import { Card } from 'antd';

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
            <Card title={this.state.proposal.name}>
                <p>{this.state.proposal.description}</p>
                <p>Supply: {this.state.proposal.supply} Cash</p>
            </Card>
        )
    }
}

export default ProposalDetail;