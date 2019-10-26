import React from 'react'

import { buyPrices } from './OrderBookBuy'
import { buyQuantity } from './OrderBookBuy'
import { sellPrices } from './OrderBookSell'
import { sellQuantity } from './OrderBookSell'

const Purchases = () => {
  var response = '';
  var minDiff = 100; // any large number

  for (let i = 0; i < sellPrices.length; i++) {
    for (let j = 0; j < buyPrices.length; j++) {

      // find the smallent difference between prices
      var diff = Math.abs(sellPrices[i] - buyPrices[j]);
      if (diff < minDiff) {
        minDiff = diff;
        var dealPrice = buyPrices[j];

        // let the buyer purchase how much he want
        if (buyQuantity[j] > sellQuantity[i]) {
          var dealQuantity = sellQuantity[i]
        } else {
          dealQuantity = buyQuantity[j]
        }
      }
    }
  }
  response = 'Purchase of ' + dealQuantity + ' actions for ' + dealPrice + '$ has been done.';

  return <div>
        <h4>Latest Transactions</h4>
        { response }
    </div>
};

export default Purchases