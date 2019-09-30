import React from 'react';
import axios from 'axios';

import Proposals from '../components/Proposal';

class ProposalList extends React.Component {

    state = {
        proposals: []
    };

    componentDidMount() {
        axios.get('http://127.0.0.1:8000/api/markets/proposal/true')
            .then(res => {
                this.setState({
                    proposals: res.data
                });
            })
    }

    render () {
        return (
            <Proposals data={this.state.proposals}/>
        )
    }
}

export default ProposalList;