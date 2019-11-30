import React from 'react';
import axios from "axios";
import { Table } from 'semantic-ui-react'

/**
 * @return {string}
 */
function NumScroll(num) {
    if (num > 3) {
        return 'scroll'
    } else {return 'null'}
}

var d = [{},{}];

function convert(type) {
    if (type === false) {
        return 'Buy'
    } else {
        return 'Sell'
    }
}

class OrderHistory extends React.Component {

    state = {};

	componentDidMount() {
	    d = [{},{}];

	    // axios.defaults.headers = {
        //     "Content-Type": "application/json",
        //     Authorization: `Token ${this.props.token}`
        // };
        axios.get('http://127.0.0.1:8000/api/orders')
            .then(res => {
                this.setState({
                    orders: res.data.results.filter(x => x['outcome'] === parseInt(this.props.outcome))
                });
            });

	}

	componentDidUpdate(prevProps) {
	    d = [{},{}];
	    if (this.props.outcome !== prevProps.outcome && prevProps.outcome!==undefined)
	    {
	        axios.get('http://127.0.0.1:8000/api/orders')
                .then(res => {
                    this.setState({
                        orders: res.data.results.filter(x => x['outcome'] === parseInt(this.props.outcome))
                    });
                })
	    }
	}

	render() {
		if (this.state.orders == null) {
			return <div>Loading...</div>
		}

		return (
		    <div>
                <pre style={{height: 180, overflowY: NumScroll(this.state.orders.length)}}>
                <Table striped textAlign={'center'}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Time</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Volume</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    {this.state.orders.map((ord, num) => (
                    <Table.Body key={num}>
                        <Table.Row>
                            <Table.Cell>{new Date(ord.created).getHours()}:{new Date(ord.created).getMinutes()}</Table.Cell>
                            <Table.Cell>{convert(ord.order_type)}</Table.Cell>
                            <Table.Cell>{ord.amount}</Table.Cell>
                            <Table.Cell>{ord.price}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                        ))}

                </Table>
                </pre>
            </div>
		)
	}
}

export default OrderHistory;
