import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { getData } from "./utils"

import { TypeChooser } from "react-stockcharts/lib/helper";
import axios from "axios";
import connect from "react-redux/es/connect/connect";
// import equal from 'fast-deep-equal'


var d = [{},{}];

var temp = {
        "date": null,
        "open": null,
        "high": null,
        "low": null,
        "close": null,
        "volume": null
    };

function bar(dir) {
    var unit_price = (dir.price/dir.amount);

    temp.close = unit_price;

    if (temp.volume === null) {temp.volume = dir.amount} else {temp.volume += dir.amount}

    if (temp.open === null) {temp.open = unit_price}

    if (temp.high === null || temp.high < unit_price) {temp.high = unit_price}

    if (temp.low === null || temp.low > unit_price) {temp.low = unit_price}

}

function f(dict, minutes) {
    var i = 0;
    var start = (new Date(dict[0].created).getTime());
    var end = (new Date(dict[dict.length-1].created).getTime());
    var num_intervals = (parseInt(((start-end)/(1000*60)/10) +1));

    for (; i<num_intervals; i++) {
        temp.date = end + minutes*(i+1)*60000;
        dict.filter(x => (new Date(x['created']).getTime() <= end + minutes*(i+1)*60000
            && new Date(x['created']).getTime() >= end + minutes*(i)*60000))
            .forEach(e => bar(e));

        if (temp.volume !== null) {
            d.push(temp,);

            temp = {
            "date": null,
            "open": null,
            "high": null,
            "low": null,
            "close": null,
            "volume": null
            };
        }
    }
}

class ChartComponent extends React.Component {

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

                    if (this.state.orders.length === 0) {
                        this.setState({
                            orders: d
                        })
                    }
                    f(this.state.orders, 10);

                    let data = d.map((obj) => {
                        let date = obj.date;
                        obj.date = new Date(date);
                        return obj
                    });

                    this.setState({ data });
                });
        }
    }

	componentWillReceiveProps(nextProps) {
	    // let data = d.map((obj) => {
        //                 let date = obj.date;
        //                 obj.date = new Date(date);
        //                 return obj
        //             });
        //             this.setState({ data });
	    d = [{},{}];

        if(this.props !== nextProps) {

            if (nextProps.token) {
                this.test();
                // this.state.timer = setInterval(() => this.test(), 500);

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
            //
            //         f(this.state.orders, 10);
            //
            //         let data = d.map((obj) => {
            //             let date = obj.date;
            //             obj.date = new Date(date);
            //             return obj
            //         });
            //
            //         this.setState({ data });
            //     });
        }
	}

	componentWillUnmount() {
      // clearInterval(this.state.timer);
    }

	componentDidUpdate(prevProps) {
	    d = [{},{}];
	    if (this.props.outcome !== prevProps.outcome && prevProps.outcome!==undefined)
	    {
	        if (this.props.token || prevProps.token) {
                this.test();
                // this.timer = setInterval(() => this.test(), 500);
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
            //
            //         f(this.state.orders, 10);
            //
            //         let data = d.map((obj) => {
            //             let date = obj.date;
            //             obj.date = new Date(date);
            //             return obj
            //         });
            //         this.setState({ data });
            //
            //     })
	    }
	}

	render() {
		if (this.state.data == null) {
			return <div>Loading...</div>
		}

		return (
		    <div>
		        <Chart type={"hybrid"} data={this.state.data} />
            </div>
		)
	}
}

const mapStateToProps = state => {
  return {
    token: state.auth.token
  };
};

// export default ChartComponent;
export default connect(mapStateToProps)(ChartComponent);
