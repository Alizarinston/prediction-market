import React from 'react';
import axios from 'axios';

import Proposals from '../components/Proposal';
import { Link } from 'react-router-dom';

class ProposalList extends React.Component {

    state = {
        proposals: []
    };

    componentDidMount() {
        axios.get('http://127.0.0.1:8000/api/markets/proposal/true/')
            .then(res => {
                this.setState({
                    proposals: res.data
                });
            })
    }

    render () {
        return (
            <div>
                <Proposals data={this.state.proposals}/>
                <br/>
                <h2><Link to="/proposal/create/">Create a proposal</Link></h2>
            </div>
        )
    }
}

export default ProposalList;