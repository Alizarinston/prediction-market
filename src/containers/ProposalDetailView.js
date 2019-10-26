import React from 'react';
import axios from 'axios';

import { Card } from 'antd';
import { Grid, Image, Rail, Segment, Button, Progress } from 'semantic-ui-react'
import Intro from './chart/intro';
import OrderBook from './OrderBook/OrderBookView';
import {Element} from 'react-scroll';

/**
 * @return {string}
 */
function NumScroll(num) {
    if (num > 7) {
        return 'scroll'
    } else {return 'null'}
}

class ProposalDetail extends React.Component {

    state = {
        proposal: [],
        outcomes: ['null']
    };

    colors = [
      'red',
      'orange',
      'yellow',
      'olive',
      'green',
      'teal',
      'blue',
      'violet',
      'purple',
      'pink',
      'brown',
      'grey',
      'black',
    ];

    componentDidMount() {
        const proposalID = this.props.match.params.proposalID;
        axios.get(`http://127.0.0.1:8000/api/markets/${proposalID}/`)
            .then(res => {
                // if (!res.data.proposal) {
                //     res.data = []
                //     // тут нужно вызвать ошибку, there is no such proposal
                // }
                this.setState({
                    proposal: res.data,
                    outcomes: res.data.outcomes
                });
                // console.log(this.state.proposal.outcomes[0].description);
                // console.log(this.state.outcomes[0].description)
            })
    }

    render () {
        return (
            <div>
                <br/><br/><br/>
                <Grid columns={3}>
                    <Grid.Column floated={"left"}>
                        <Segment>
                            <Intro/>
                        </Segment>
                    </Grid.Column>

                    <Grid.Column stretched width={6}>
                        <Segment>
                            <Image src='/images/wireframe/paragraph.png' />

                            {/*<Rail dividing position='left'>*/}
                                {/*<Segment>Left Rail Content</Segment>*/}
                            {/*</Rail>*/}

                            <Card title={this.state.proposal.name}>
                                <p>{this.state.proposal.description}</p>
                                <p>Supply: {this.state.proposal.supply} Cash</p>
                            </Card>

                            {/*<Rail dividing position='right'>*/}
                                {/*<Segment>*/}
                                    {/*/!*{this.state.outcomes[0].description}*!/*/}

                                    {/*{this.state.outcomes.map((o, num) => (*/}
                                        {/*<Button.Group fluid labeled key={num} basic color={this.colors[num%13]} vertical attached={"bottom"} compact>*/}
                                            {/*<Button attached fluid>{o.description}</Button>*/}
                                            {/*<Progress percent={o.probability} attached={"bottom"} color={this.colors[num%13]}/>*/}
                                        {/*</Button.Group>*/}
                                    {/*))}*/}
                                {/*</Segment>*/}
                            {/*</Rail>*/}
                        </Segment>

                        <Segment>
                            <OrderBook/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column floated={"right"} width={4}>

                            <Element className="element" id="scroll-container" style={{
                                // position: 'relative',
                                height: '316px',
                                overflow: NumScroll(this.state.outcomes.length),
                                // marginBottom: '100px'
                            }}>

                                <Segment>
                                {this.state.outcomes.map((o, num) => (
                                    <Button.Group toggle fluid labeled key={num} basic color={this.colors[num%13]} vertical >
                                        <Button toggle>{o.description}</Button>
                                        <Progress percent={o.probability} attached={"bottom"} color={this.colors[num%13]}/>
                                    </Button.Group>
                                ))}
                                </Segment>

                            </Element>

                    </Grid.Column>
                </Grid>
            </div>
            // <Card title={this.state.proposal.name}>
            //     <p>{this.state.proposal.description}</p>
            //     <p>Supply: {this.state.proposal.supply} Cash</p>
            // </Card>
        )
    }
}

export default ProposalDetail;