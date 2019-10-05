import React from 'react';
import { Image, Rail, Segment, Header, Progress, Item } from 'semantic-ui-react'


const Proposals = (props) => {

    function checkColor(a, b) {
        if (a < b) {
            return "yellow"
        } else {
            return "red"
        }
    }

    return (

        <div>

            {props.data.map(item => (
                <Segment key={item.name}>

                    {
                        <a href={`/markets/${item.id}`}>
                            <Header as='h2' attached='top' inverted>
                                <Image circular src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png' />
                                {item.name}
                            </Header>
                        </a>
                    }

                    {/*<Image src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png' size="small" />*/}

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

export default Proposals;