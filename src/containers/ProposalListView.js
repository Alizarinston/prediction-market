import React, { createRef } from 'react';
import axios from 'axios';

import Proposals from '../components/Proposal';
import { Link } from 'react-router-dom';
import {Grid, Rail, Sticky, Menu, Dropdown, Ref, Button, Modal, Segment } from "semantic-ui-react";
import CustomForm from '../components/Form';
import PublicWebSocketInstance from "../websocket_anon";
import WebSocketInstance from "../websocket";

class ProposalList extends React.Component {

  contextRef = createRef();

  state = {
    proposals: []
  };

  constructor(props) {
    super(props);
    PublicWebSocketInstance.addCallbacks(this.setMessages.bind(this));
  }

  setMessages(markets) {
    this.setState({
      proposals: markets
    });
  }

  componentDidMount() {
    // axios.get('http://127.0.0.1:8000/api/markets/?proposal=true')
    //     .then(res => {
    //         this.setState({
    //             proposals: res.data.results
    //         });
    //         console.log('PROPOSAL: ', res.data.results)
    //     });

    PublicWebSocketInstance.connect('markets')
  }

  componentWillUnmount() {
    if (PublicWebSocketInstance.socketRef) {
      PublicWebSocketInstance.socketRef.close(1000, "Closing Connection Normally");
    }
  }

  render () {
    return (
      <div>
        <br/><br/>
        <Grid centered columns={2}>
          <Ref innerRef={this.contextRef}>
            <Grid.Column>
              <Sticky context={this.contextRef} offset={100}>
                <Rail dividing position='left'>

                  {/*<Menu vertical>
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
                                    </Menu>*/}

                </Rail>
              </Sticky>

              <br/>

              {/*<Modal size={"small"} trigger={<Button>Test</Button>}>
                                    <CustomForm
                                        requestType="post"
                                        btnText="Create"/>
                            </Modal>*/}

              {/*<Link to="/proposal/create/">
                                <Button>
                                    Create a proposal
                                </Button>
                            </Link>*/}

              <Proposals data={this.state.proposals}/>

            </Grid.Column>
          </Ref>
        </Grid>
      </div>
    )
  }
}

export default ProposalList;
