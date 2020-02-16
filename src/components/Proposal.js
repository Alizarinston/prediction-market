import React from 'react';
import { Rail, Segment, Header, Progress, Statistic, Icon, Label, Container, Card, Popup, Button, Grid } from 'semantic-ui-react'
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

  function getCategory(itemCategory) {
    if (itemCategory === 'SPO') {
      return ({
        icon: "futbol",
        color: 'green',
        title: 'Sports'
      })
    } else if (itemCategory === 'POL') {
      return ({
        icon: "handshake",
        color: 'blue',
        title: 'Politics'
      })
    } else if (itemCategory === 'FIN') {
      return ({
        icon: "dollar",
        color: 'red',
        title: 'Finances'
      })
    } else if (itemCategory === 'OTH') {
      return ({
        icon: "question",
        color: 'grey',
        title: 'Other'
      })
    }
  }

  const colors = [
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


  return (

    <div>

      <br/><br/>
      {props.data.map((item, k)=> (
        <div key={k}>
          {/*<br/><br/><br/>*/}
          <br/>
          <Link to={{pathname: `/markets/${item.id}`}}>
            <Card link fluid style={{border:'1px solid #17394d', boxShadow: 0}}>
              <Segment size={"massive"} textAlign={'center'} padded basic>

                {/*<Header as={'h3'} color={'grey'}>*/}
                <Container textAlign={'left'}>
                  <p style={{color: "#17394d", transition: .3, margin: 0, fontFamily: "veranda", fontSize: 16, fontWeight: 400, letterSpacing: .1}}>
                    {item.name}?
                  </p>
                </Container>
                {/*</Header>*/}

                <Rail close={"very"} position='right' dividing size={"massive"}>
                  {/*<Segment padded style={{border: '1px solid #17394d', lineHeight: 100}}>*/}
                  <Card fluid style={{border:'1px solid #17394d', boxShadow: 0}}>
                    <Segment textAlign={'center'} padded basic>
                      {/*<Header a={'h2'} color={'grey'}>*/}
                      <p style={{color: "#17394d"}}>
                        {/*<Statistic>*/}
                        <Countdown date={item.end_date}/>
                        {/*</Statistic>*/}
                      </p>
                    </Segment>
                  </Card>
                  {/*</Header>*/}
                  {/*</Segment>*/}
                </Rail>

              </Segment>



              {/*<Link to={`/proposals/${item.id}`}>*/}
              {/*<Segment>*/}
              {/*<Container text textAlign={"center"}>*/}
              {/*<Header as={"h3"}>*/}
              {/*{item.description}*/}
              {/*</Header>*/}
              {/*</Container>*/}
              {/*</Segment>*/}
              {/*</Link>*/}


            </Card>
          </Link>

          {/*<Popup hideOnScroll position={"bottom center"} hoverable flowing basic pinned
                        trigger={
                            <Card link fluid>
                                <Segment.Group stacked piled raised>

                                    <Link to={`/proposals/${item.id}`}>
                                        <Segment padded stacked size={"huge"}>


                                            <Label as='a' color={getCategory(item.category)['color']} tag
                                                   attached={"top right"} size={"small"}>
                                                <Icon name={getCategory(item.category)['icon']}/>
                                                {getCategory(item.category)['title']}
                                            </Label>


                                            {
                                                <span>
                                                    <Header as='h2'>
                                                        {item.name}
                                                    </Header>
                                                </span>
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
                                            <Label attached='bottom' ribbon
                                                   color={checkColor(new Date(Date.now()).getTime(), new Date(item.end_date).getTime())}>
                                                <Statistic.Group>

                                                    <Statistic>
                                                        <Statistic.Value>
                                                            <Label attached={"bottom"}>{item.end_date}</Label>
                                                        </Statistic.Value>
                                                    </Statistic>

                                                    <Statistic>
                                                        <Statistic.Value>
                                                            <Label attached={"bottom left"}>Supply: {item.supply} <Icon
                                                                name={"bolt"}/></Label>
                                                        </Statistic.Value>
                                                    </Statistic>

                                                    <Statistic>
                                                        <Statistic.Value>
                                                            <Countdown date={item.end_date}/>
                                                        </Statistic.Value>
                                                    </Statistic>

                                                </Statistic.Group>
                                            </Label>

                                            <Progress
                                                percent={new Date(Date.now()).getDate() * 100 / new Date(item.end_date).getDate()}
                                                attached={"bottom"}
                                                color={checkColor(new Date(Date.now()).getTime(), new Date(item.end_date).getTime())}/>

                                        </Segment>
                                    </Link>


                                    <Rail dividing position='right'>
                                        <Segment>
                                            <Popup trigger={<Segment/>} flowing hoverable>

                                                {item.outcomes.map(o => (
                                                    <Segment key={o.id}>{o.description}</Segment>
                                                ))}

                                            </Popup>

                                            {item.outcomes.map( o => (
                                   <Segment key={o.id}>{o.description}</Segment>
                                ))}

                                        </Segment>
                                    </Rail>


                                </Segment.Group>
                            </Card>
                        }>

                        <Grid padded columns={(6 < item.outcomes.length) ? (5 % item.outcomes.length) : item.outcomes.length}>
                            {item.outcomes.map((o, num) => (
                                //<Grid.Column>
                                <Button.Group labeled key={num} basic color={colors[num%13]} vertical attached={"bottom"} compact>
                                    <Button attached fluid>{o.description}</Button>
                                    <Progress percent={o.probability} attached={"bottom"} color={colors[num%13]}/>
                                </Button.Group>
                                // <Column>
                            ))}
                        </Grid>

                    </Popup>*/}
        </div>

      ))}

    </div>

  )
};

export default Proposals;