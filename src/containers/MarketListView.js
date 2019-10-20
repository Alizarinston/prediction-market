import React, {createRef} from 'react';
import axios from 'axios';
// import { connect } from 'react-redux';
import Markets from '../components/Market';
import {Grid, Rail, Sticky, Menu, Dropdown, Ref} from "semantic-ui-react";


class MarketList extends React.Component {
    contextRef = createRef();

    state = {
        markets: []
    };

    fetchMarkets = () => {
    axios.get("http://127.0.0.1:8000/api/markets/proposal/false/").then(res => {
      this.setState({
        markets: res.data
      });
    });
};

    componentDidMount() {
    this.fetchMarkets();
}

    componentWillReceiveProps(newProps) {
    if (newProps.token) {
      this.fetchMarkets();
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
            <div>
                <br/><br/>
                <Grid centered columns={2}>
                    <Ref innerRef={this.contextRef}>
                        <Grid.Column>
                            <Sticky context={this.contextRef} offset={100}>
                                <Rail dividing position='left'>

                                    <Menu vertical>
                                        <Menu.Item>Categories</Menu.Item>
                                        <Dropdown text='Messages' pointing='left' className='link item'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item>Inbox</Dropdown.Item>
                                                <Dropdown.Item>Starred</Dropdown.Item>
                                                <Dropdown.Item>Sent Mail</Dropdown.Item>
                                                <Dropdown.Item>Drafts (143)</Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item>Spam (1009)</Dropdown.Item>
                                                <Dropdown.Item>Trash</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <Menu.Item>Browse</Menu.Item>
                                        <Menu.Item>Help</Menu.Item>
                                    </Menu>

                                </Rail>
                            </Sticky>

                            <Markets data={this.state.markets}/>

                        </Grid.Column>
                    </Ref>
                </Grid>
            </div>
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
