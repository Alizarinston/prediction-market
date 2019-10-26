
import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { getData } from "./utils"

import { TypeChooser } from "react-stockcharts/lib/helper";

const d = [
    {
        "date": "2016-04-15T13:30:00.000Z",
        "open": 55.3,
        "high": 55.3,
        "low": 55.25,
        "close": 55.25,
        "volume": 10
    },
    {
        "date": "2016-04-16T13:30:00.000Z",
        "open": 55.24,
        "high": 55.39,
        "low": 55.25,
        "close": 55.25,
        "volume": 2
    },
    {
        "date": "2016-04-17T13:30:00.000Z",
        "open": 55.37,
        "high": 55.5299,
        "low": 55.37,
        "close": 55.5299,
        "volume": 13
    },
    {
        "date": "2016-04-18T13:30:00.000Z",
        "open": 55.52,
        "high": 55.59,
        "low": 55.52,
        "close": 55.59,
        "volume": 7
    },
    ];

class ChartComponent extends React.Component {
	componentDidMount() {
	    let data = d.map((obj) => {
	        let date = obj.date;
            obj.date = new Date(date);
            return obj
        });
        this.setState({ data })

		// getData().then(data => {
		// 	this.setState({ data });
		// 	// this.setState(d);
        //     console.log(data)
		// })
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
		    <Chart type={"hybrid"} data={this.state.data} />
		)
	}
}


export default ChartComponent;