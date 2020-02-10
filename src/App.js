import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import BaseRouter from "./routes";
import * as actions from "./store/actions/auth";
import "semantic-ui-css/semantic.min.css";
import CustomLayout from "./containers/Layout";
import WebSocketInstance from "./websocket";

class App extends Component {

  test() {
    this.props.onTryAutoSignup();
  }

  componentDidMount() {
    if (!this.props.isAuthenticated) {

        this.test();
        // this.timer = setInterval(() => this.test(), 500);
    }

  }

  componentWillUnmount() {
    // this.timer = null;
  }

  constructor(props) {
        super(props);
        this.state = {};
        WebSocketInstance.addCallbacks(this.setMessages.bind(this));
        WebSocketInstance.fetchToken(this.props.token);
  }

  setMessages(username, cash) {
    this.setState({ username: username,
                    cash: cash});
  }

  render() {
    return (
      <Router>
        <CustomLayout {...this.props} username={this.state.username} cash={this.state.cash}>
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
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
