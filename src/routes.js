import React from 'react';
import { Route } from 'react-router-dom';

import MarketList from './containers/MarketListView';
import MarketDetail from "./containers/MarketDetailView";
import ProposalList from "./containers/ProposalListView";
import ProposalDetail from "./containers/ProposalDetailView";
import ProposalCreate from "./containers/ProposalCreateView";
import Login from './containers/Login';
import Signup from './containers/Signup';
import HomepageLayout from './containers/Home';
import Hoc from './hoc/hoc';

const BaseRouter = () => (
    <Hoc>
        {/*<Route exact path='/markets/' component={MarketList}/>*/}
        <Route exact path='/markets/' component={ProposalList}/>
        {/*<Route exact path='/markets/:marketID' component={MarketDetail}/>*/}
        <Route exact path='/markets/:marketID' component={ProposalDetail}/>
        {/*<Route exact path='/proposals/' component={ProposalList}/>*/}
        {/*<Route exact path='/proposals/:proposalID' component={ProposalDetail}/>*/}
        <Route exact path='/proposal/create/' component={ProposalCreate}/>
        <Route path='/login' component={Login}/>
        <Route path='/signup' component={Signup}/>
        <Route exact path='/' component={HomepageLayout}/>
    </Hoc>
);

export default BaseRouter;