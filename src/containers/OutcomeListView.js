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

    render() {
        return (
            <div>
                <Segment>
                <pre style={{height: 316, overflowY: NumScroll(this.props.data.length)}}>


                    {this.props.data.map((o, num) => (
                        <Segment basic>
                            <Button.Group toggle fluid labeled key={num} basic color={this.colors[num % 13]} vertical>

                                <Button active id={o.id} value={o.description} onClick={(e) => this.props.handler(e)}>
                                    <Container>
                                        {o.description}
                                    </Container>
                                    <Label size={'tiny'} attached={"top left"} as='a' color={this.colors[num % 13]}>
                                        Price: {parseFloat(o.probability).toFixed(3) + '$'}
                                    </Label>
                                    <Label tag size={'tiny'} attached={"top right"} as='a' color={this.colors[num % 13]}>
                                        Balance: {o.outstanding}
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