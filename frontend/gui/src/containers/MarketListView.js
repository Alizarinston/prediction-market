import React from 'react';
import axios from 'axios';
// import { connect } from 'react-redux';

import Markets from '../components/Market';

class MarketList extends React.Component {

    state = {
        markets: []
    };

    fetchArticles = () => {
    axios.get("http://127.0.0.1:8000/api/markets/proposal/false/").then(res => {
      this.setState({
        markets: res.data
      });
    });
};

    componentDidMount() {
    this.fetchArticles();
}

    componentWillReceiveProps(newProps) {
    if (newProps.token) {
      this.fetchArticles();
    }
}

    // componentWillReceiveProps(newProps) {
    //     if (newProps.token) {
    //
    //         axios.defaults.headers = {
    //             "Content-Type": "application/json",
    //             Authorization: `Token ${newProps.token}$`
    //         };
    //
    //         axios.get('http://127.0.0.1:8000/api/markets/proposal/false/')
    //             .then(res => {
    //                 this.setState({
    //                     markets: res.data
    //                 });
    //             })
    //     }
    // }

    render () {
        return (
            <Markets data={this.state.markets}/>
        )
    }
}


// const mapStateToProps = state => {
//   return {
//       token: state.token
//   }
// };
//
// export default connect(mapStateToProps)(MarketList);

export default MarketList;
