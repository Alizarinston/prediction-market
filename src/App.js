import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import BaseRouter from "./routes";
import * as actions from "./store/actions/auth";
import "semantic-ui-css/semantic.min.css";
import CustomLayout from "./containers/Layout";
import WebSocketInstance from "./websocket";


class App extends Component {

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.props.onTryAutoSignup();
    }
  }

  constructor(props) {
    super(props);
    WebSocketInstance.addCallbacks(this.props.setProfile.bind(this));
  }

  render() {
    return (
      <Router>
        <CustomLayout {...this.props}>
          <BaseRouter/>
        </CustomLayout>
      </Router>
    );
  }

}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    setProfile: (username, cash, wallet) => dispatch(actions.authUpdate(username, cash, wallet))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
