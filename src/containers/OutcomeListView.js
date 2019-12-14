import React from 'react';
import {Button, Container, Label, Progress, Segment} from "semantic-ui-react";

/**
 * @return {string}
 */
function NumScroll(num) {
    if (num > 7) {
        return 'scroll'
    } else {return 'null'}
}

class OutcomeList extends React.Component{

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

    // default height: 316
    render() {
        return (
            <div>
                <Segment>
                    <pre style={{height: 540, overflowY: NumScroll(this.props.data.length)}}>


                        {this.props.data.map((o, num) => (
                            <Segment basic key={num}>
                                <Button.Group toggle fluid labeled basic color={this.colors[num % 13]} vertical style={{border:`1px solid ${this.colors[num % 13]}`}}>

                                    <Button active id={o.id} value={o.description} onClick={(e) => this.props.handler(e)}>
                                        <Container>
                                            {o.description}
                                        </Container>
                                        <Label size={'tiny'} attached={"top left"} as='a' color={this.colors[num % 13]}>
                                            Price: {parseFloat(o.probability).toFixed(3) + '$'}
                                        </Label>
                                        <Label tag size={'tiny'} attached={"top right"} as='a' color={this.colors[num % 13]}>
                                            {/*Balance: {o.amount}*/}
                                            Balance: {(this.props.wallet[o.id]) ? this.props.wallet[o.id] : 0}
                                        </Label>
                                    </Button>

                                    <Progress percent={o.probability * 100} attached={"bottom"} color={this.colors[num % 13]}/>
                                </Button.Group>
                            </Segment>
                        ))}


                    </pre>
                </Segment>
            </div>
        )
    }
}

export default OutcomeList;