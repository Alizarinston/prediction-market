import React from 'react';
import { Route } from 'react-router-dom';

import MarketList from './containers/MarketListView';
import MarketDetail from "./containers/MarketDetailView";
import ProposalList from "./containers/ProposalListView";
import ProposalDetail from "./containers/ProposalDetailView";

const BaseRouter = () => (
    <div>
        <Route exact path='/' component={MarketList}/>
        <Route exact path='/:marketID' component={MarketDetail}/>
        <Route exact path='/proposals/' component={ProposalList}/>
        <Route exact path='/proposals/:proposalID' component={ProposalDetail}/>
    </div>
);

export default BaseRouter;