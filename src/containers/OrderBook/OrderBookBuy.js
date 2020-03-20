import React from 'react'

var buyPrices = [26.10, 26.03, 26.02];
var buyQuantity = [100, 42, 127];
var buySum = [];

const OrderBookBuy = () => {
    var table = [];

    for (let i = 0; i < buyPrices.length; i++) {
        buySum[i] = buyPrices[i] * buyQuantity[i]
    }
    table.push(<tr><td><b>Prices</b></td>
        <td><b>Quantity</b></td>
        <td><b>Sum</b></td></tr>);

    for (let i = 0; i < buyPrices.length; i++) {
        table.push(<tr>
            <td>{ buyPrices[i] }</td>
            <td>{ buyQuantity[i] }</td>
            <td>{ buySum[i] }</td>
        </tr>)
    }

    return <div>
        <h4>Buy Offers (BID)</h4>
        <table>{ table }</table>
    </div>
};

export default OrderBookBuy
export { buyPrices }
export { buyQuantity }