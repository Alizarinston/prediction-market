import React from 'react';
import { Rail, Segment, Header, Progress, Statistic, Icon, Label, Container, Card } from 'semantic-ui-react'
import Countdown from "./Countdown";
import { Link } from 'react-router-dom';


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
                icon: "question",
                color: 'grey'
            })
        }
    }


    return (

        <div>

            {props.data.map(item => (
                <div>
                    <br/><br/>
                    <Card link fluid>
                        <Segment.Group stacked key={item.id} piled raised>

                            <Link to={`/proposals/${item.id}`}>
                                <Segment padded stacked size={"huge"}>

                                    <Label as='a' color={category(item.categories)['color']} tag attached={"top right"} size={"small"}>
                                        <Icon name={category(item.categories)['icon']}/>
                                        {item.categories}
                                    </Label>

                                    {
                                        <a>
                                            <Header as='h2' >
                                                {item.name}
                                            </Header>
                                        </a>
                                    }

                                </Segment>
                            </Link>

                            <Link to={`/proposals/${item.id}`}>
                                <Segment>
                                    <Container text textAlign={"center"}>
                                        <Header as={"h3"}>
                                            {item.description}
                                        </Header>
                                    </Container>
                                </Segment>
                            </Link>

                            <Link to={`/proposals/${item.id}`}>
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
                            </Link>


                            <Rail dividing position='right'>
                                <Segment>{item.outcomes}</Segment>
                            </Rail>


                        </Segment.Group>
                    </Card>
                </div>

            ))}

        </div>

    )
};

export default Proposals;