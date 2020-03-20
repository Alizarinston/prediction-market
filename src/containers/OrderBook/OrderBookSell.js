import React from 'react'

var sellPrices = [26.78, 26.79, 26.85];
var sellQuantity = [34, 46, 74];
var sellSum = [];

const OrderBookSell = () => {
  var table = [];

  for (let i = 0; i < sellPrices.length; i++) {
    sellSum[i] = sellPrices[i] * sellQuantity[i]
  }

  table.push(<tr><td><b>Prices</b></td>
    <td><b>Quantity</b></td>
    <td><b>Sum</b></td></tr>);

  for (let i = 0; i < sellPrices.length; i++) {
    table.push(<tr>
      <td>{ sellPrices[i] }</td>
      <td>{ sellQuantity[i] }</td>
      <td>{ sellSum[i] }</td>
    </tr>)
  }

  return <div>
    <h4>Sell Offers (ASK)</h4>
    <table>{ table }</table>
  </div>
};

export default OrderBookSell
export { sellPrices }
export { sellQuantity }