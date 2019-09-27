import React from 'react';
import { Route } from 'react-router-dom';

import MarketList from './containers/MarketListView';
import MarketDetail from "./containers/MarketDetailView";

const BaseRouter = () => (
    <div>
        <Route exact path='/' component={MarketList}/>
        <Route exact path='/:marketID' component={MarketDetail}/>
    </div>
);

export default BaseRouter;