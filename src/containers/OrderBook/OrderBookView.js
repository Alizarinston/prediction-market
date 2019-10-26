import React from "react";
import OrderBookBuy from './OrderBookBuy'
import OrderBookSell from './OrderBookSell'
import Purchases from './Purchases'
import './OrderBookView.css'

const MyApp = () => (
  <div className='App'>
    <div className="OrderBook"><OrderBookBuy /></div>
      <div className="OrderBook"><OrderBookSell /></div>
    <div className="Purchases"><Purchases /></div>
  </div>
);

export default MyApp