import React from 'react';
import { Route } from 'react-router-dom';

import MarketList from './containers/MarketListView';
import MarketDetail from "./containers/MarketDetailView";
import ProposalList from "./containers/ProposalListView";
import ProposalDetail from "./containers/ProposalDetailView";
import Login from './containers/Login';
import Signup from './containers/Signup';

const BaseRouter = () => (
    <div>
        <Route exact path='/markets/' component={MarketList}/>
        <Route exact path='/markets/:marketID' component={MarketDetail}/>
        <Route exact path='/proposals/' component={ProposalList}/>
        <Route exact path='/proposals/:proposalID' component={ProposalDetail}/>
        <Route exact path='/login/' component={Login}/>
        <Route exact path='/signup/' component={Signup}/>
    </div>
);

export default BaseRouter;