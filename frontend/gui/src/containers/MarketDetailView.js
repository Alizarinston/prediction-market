import React from 'react';
import axios from 'axios';

import { Card } from 'antd';

class MarketDetail extends React.Component {

    state = {
        market: {}
    };

    componentDidMount() {
        const marketID = this.props.match.params.marketID;
        axios.get(`http://127.0.0.1:8000/api/markets/${marketID}`)
            .then(res => {
                this.setState({
                    market: res.data
                });
            })
    }

    render () {
        return (
            <Card title={this.state.market.name}>
                <p>{this.state.market.description}</p>
            </Card>
        )
    }
}

export default MarketDetail;