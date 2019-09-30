import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { Card } from 'antd';

class MarketDetail extends React.Component {

    state = {
        market: {}
    };

//     componentDidMount() {
//         axios.defaults.headers = {
//       "Content-Type": "application/json",
//       Authorization: `Token ${this.props.token}`
// };
//         console.log(this.props.token);
//     const marketID = this.props.match.params.marketID;
//     axios.get(`http://127.0.0.1:8000/api/markets/${marketID}/`).then(res => {
//       this.setState({
//         market: res.data
//       });
//     });
// }


    componentWillReceiveProps(newProps) {
        if (newProps.token) {

            axios.defaults.headers = {
                "Content-Type": "application/json",
                Authorization: `Token ${newProps.token}`
            };

            const marketID = this.props.match.params.marketID;
            axios.get(`http://127.0.0.1:8000/api/markets/${marketID}/`)

                .then(res => {
                    this.setState({
                        market: res.data
                    });
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }


    render () {
        return (
            <Card title={this.state.market.name}>
                <p>{this.state.market.description}</p>
                <p>{this.state.market.end_date}</p>
            </Card>
        )
    }
}

const mapStateToProps = state => {
  return {
    token: state.token
  };
};

export default connect(mapStateToProps)(MarketDetail);