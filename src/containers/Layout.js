import React from "react";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";

class CustomLayout extends React.Component {
  render() {
    const { authenticated, username, cash } = this.props;

    return (
      <div>
        <Menu fixed="top" inverted size={"large"}>
          {/*<Container>*/}
          <Container>
              {authenticated ? (
                  <Link to="/">
                      <Menu.Item header>Profile</Menu.Item>
                  </Link>
              ) : (<Link to="/">
                  <Menu.Item header>Home</Menu.Item>
              </Link>)}
              {authenticated ? (
                  <React.Fragment>
                      <Link to="/proposals/">
                          <Menu.Item header>Proposal</Menu.Item>
                      </Link>
                      <Link to="/markets/">
                          <Menu.Item header>Markets</Menu.Item>
                      </Link>
                      {/*<Menu.Item header onClick={() => this.props.logout()}>*/}
                          {/*Logout*/}
                      {/*</Menu.Item>*/}
                  </React.Fragment>
              ) : (
                  <React.Fragment>
                    <Link to="/proposals/">
                        <Menu.Item header>Proposal</Menu.Item>
                    </Link>
                      {/*<Link to="/login">
                          <Menu.Item header>Login</Menu.Item>
                      </Link>
                      <Link to="/signup">
                          <Menu.Item header>Signup</Menu.Item>
                      </Link>*/}
                  </React.Fragment>
              )}
          </Container>

              {authenticated ? (
                  <React.Fragment>
                      <Menu.Menu position={'right'}>
                      <Menu.Item>
                          {username}
                      </Menu.Item>
                      <Menu.Item>
                          Cash: {cash}
                      </Menu.Item>
                      <Menu.Item header onClick={() => this.props.logout()}>
                        Logout
                      </Menu.Item>
                      </Menu.Menu>
                  </React.Fragment>
              ) : (
                  <React.Fragment>
                    <Link to="/login">
                        <Menu.Item header>Login</Menu.Item>
                    </Link>
                    <Link to="/signup">
                        <Menu.Item header>Signup</Menu.Item>
                    </Link>
                  </React.Fragment>
              )}

          {/*</Container>*/}
        </Menu>

        {this.props.children}

        <Segment
          inverted
          vertical
          style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
        >
          <Container textAlign="center">
            <Grid divided inverted stackable>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 1" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 2" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 3" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header inverted as="h4" content="Footer Header" />
                <p>
                  Extra space for a call to action inside the footer that could
                  help re-engage users.
                </p>
              </Grid.Column>
            </Grid>

            <Divider inverted section />
            <Image centered size="mini" src="/logo.png" />
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="#">
                Site Map
              </List.Item>
              <List.Item as="a" href="#">
                Contact Us
              </List.Item>
              <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
      username: state.auth.username,
      cash: state.auth.cash,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);

