import React from 'react';
import { Image, Rail, Segment, Header, Progress } from 'semantic-ui-react'


const Markets = (props) => {

    function checkColor(a, b) {
        if (a < b) {
            return "yellow"
        } else {
            return "green"
        }
    }

    return (

        <div>

            {props.data.map(item => (
                <Segment key={item.name}>

                    {
                        <a href={`/markets/${item.id}`}>
                            <Header as='h2' attached='top' inverted>
                                {item.name}
                            </Header>
                        </a>
                    }

                    <Image src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png' size="small" />

                    <Progress percent={new Date(Date.now()).getDate() * 100 / new Date(item.end_date).getDate()}
                              attached={"bottom"}
                              color={checkColor(new Date(Date.now()).getDate(), new Date(item.end_date).getDate())}/>

                    <Rail dividing position='right'>
                        <Segment>Right Rail Content</Segment>
                    </Rail>

                </Segment>
            ))}

        </div>

    )
};

export default Markets;