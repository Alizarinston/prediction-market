import React from 'react';
import axios from "axios";
import { Table } from 'semantic-ui-react'
import connect from "react-redux/es/connect/connect";
// import PublicWebSocketInstance from ".../websocket_anon";


function decimalAdjust(type, value, exp) {
  // Если степень не определена, либо равна нулю...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // Если значение не является числом, либо степень не является целым числом...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Сдвиг разрядов
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Обратный сдвиг
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

function round(value, exp) {
  return decimalAdjust('round', value, exp);
}

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
    return 'Купівля'
  } else {
    return 'Продаж'
  }
}

class OrderHistory extends React.Component {

  // constructor(props) {
  //   super(props);
  //   PublicWebSocketInstance.addCallbacks(this.setMessages.bind(this));
  // }
  //
  // setMessages(data) {
  //   this.setState({
  //     orders: data
  //   });
  // }

  state = {};

  test() {
    {
      axios.get('http://127.0.0.1:8000/api/orders/', {headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.props.token}`
        }})
        .then(res => {
          this.setState({
            orders: res.data.results.filter(x => x['outcome'] === parseInt(this.props.outcome))
          });
        });
    }
  }

  // componentDidMount() {
  //   this.setState({
  //     orders: this.props.orders.filter(x => x['outcome'] === parseInt(this.props.outcome))
  //   });
  // }

  componentWillReceiveProps(nextProps) {
    d = [{},{}];

    // axios.defaults.headers = {
    //     "Content-Type": "application/json",
    //     Authorization: `Token ${this.props.token}`
    // };
    if(this.props !== nextProps){

      if (this.props.token) {
        // this.test();

        // clearInterval(this.state.timer);

        // let timer = setInterval(() => this.test(), 500);
        // this.setState({ timer: timer })
      }

      // axios.get('http://127.0.0.1:8000/api/orders/', {headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Token ${this.props.token}`
      //     }})
      //     .then(res => {
      //         this.setState({
      //             orders: res.data.results.filter(x => x['outcome'] === parseInt(this.props.outcome))
      //         });
      //     });
    }
  }

  /*componentDidUpdate(prevProps) {
      d = [{},{}];
      if (this.props.outcome !== prevProps.outcome && prevProps.outcome!==undefined)
      {
          axios.get('http://127.0.0.1:8000/api/orders/', {headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${this.props.token}`
                }})
                .then(res => {
                    this.setState({
                        orders: res.data.results.filter(x => x['outcome'] === parseInt(this.props.outcome))
                    });
                });
      }
  }*/

  componentWillUnmount() {
    // clearInterval(this.state.timer);
  }

  render() {
    // if (this.props.orders == null || this.props.token == null) {
    //   return <div>Loading...</div>
    // }
    let filtered = this.props.orders.filter(x => x['outcome'] === parseInt(this.props.outcome));

    return (
      <div>
                <pre style={{height: 180, overflowY: NumScroll(filtered.length)}}>
                <Table striped textAlign={'center'}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Час</Table.HeaderCell>
                        <Table.HeaderCell>Тип</Table.HeaderCell>
                        <Table.HeaderCell>Кількість</Table.HeaderCell>
                        <Table.HeaderCell>Вартість</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                  {filtered.map((ord, num) => (
                    <Table.Body key={num}>
                      <Table.Row>
                        <Table.Cell>{new Date(ord.created).getHours()}:{new Date(ord.created).getMinutes()}</Table.Cell>
                        <Table.Cell>{convert(ord.order_type)}</Table.Cell>
                        <Table.Cell>{ord.amount}</Table.Cell>
                        <Table.Cell>{round(ord.price, -2) + '$'}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}

                </Table>
                </pre>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token
  };
};

// export default OrderHistory;
export default connect(mapStateToProps)(OrderHistory);

