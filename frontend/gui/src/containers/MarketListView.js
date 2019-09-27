import React from 'react';
import axios from 'axios';

import Markets from '../components/Market';

class MarketList extends React.Component {

    state = {
        markets: []
    };

    componentDidMount() {
        axios.get('http://127.0.0.1:8000/api/markets/')
            .then(res => {
                this.setState({
                    markets: res.data
                });
            })
    }

    render () {
        return (
            <Markets data={this.state.markets}/>
        )
    }
}

export default MarketList;