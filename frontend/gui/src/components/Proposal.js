import React from 'react';
import { Rail, Segment, Header, Progress, Statistic, Icon, Label, Container} from 'semantic-ui-react'
import Countdown from "./Countdown";


const Proposals = (props) => {

    function checkColor(a, b) {
        if (a < b) {
            return "yellow"
        } else {
            return "red"
        }
    }

    function category(itemCategory) {
        if (itemCategory === 'Sports') {
            return ({
                icon: "futbol",
                color: 'green'
            })
        } else if (itemCategory === 'Politics') {
            return ({
                icon: "handshake",
                color: 'blue'
            })
        } else if (itemCategory === 'Finances') {
            return ({
                icon: "dollar",
                color: 'red'
            })
        } else if (itemCategory === 'Other') {
            return ({
                icon: "hourglass",
                color: 'grey'
            })
        }
    }


    return (

        <div>

            {props.data.map(item => (
                <div>
                    <br/><br/>
                    <Segment.Group stacked key={item.id} piled raised>

                        <Segment padded stacked size={"huge"}>

                            <Label as='a' color={category(item.categories)['color']} tag attached={"top right"} size={"small"}>
                                <Icon name={category(item.categories)['icon']}/>
                                {item.categories}
                            </Label>

                            {
                                <a href={`/markets/${item.id}`}>
                                    <Header as='h2' textAlign={"center"}>
                                        {item.name}
                                    </Header>
                                </a>
                            }

                        </Segment>

                        <Segment padded>
                            <Container text textAlign={"center"}>
                                <p>
                                    {item.description}
                                </p>
                            </Container>
                        </Segment>

                        <Segment basic raised>
                            <Label attached='bottom' ribbon color={checkColor(new Date(Date.now()).getDate(), new Date(item.end_date).getDate())}>
                                <Statistic.Group>

                                    <Statistic>
                                        <Statistic.Value>
                                            <Label attached={"bottom"}>{item.end_date}</Label>
                                        </Statistic.Value>
                                    </Statistic>

                                    <Statistic>
                                        <Statistic.Value>
                                            <Label attached={"bottom left"}>Supply: {item.supply} <Icon name={"bolt"}/></Label>
                                        </Statistic.Value>
                                    </Statistic>

                                    <Statistic>
                                        <Statistic.Value>
                                            <Countdown date={item.end_date}/>
                                        </Statistic.Value>
                                    </Statistic>

                                </Statistic.Group>
                            </Label>

                            <Progress percent={new Date(Date.now()).getDate() * 100 / new Date(item.end_date).getDate()}
                                      attached={"bottom"}
                                      color={checkColor(new Date(Date.now()).getDate(), new Date(item.end_date).getDate())}/>

                        </Segment>


                        <Rail dividing position='right'>
                            <Segment>Right Rail Content</Segment>
                        </Rail>

                    </Segment.Group>
                </div>

            ))}

        </div>

    )
};

export default Proposals;