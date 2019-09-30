import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Link, withRouter} from 'react-router-dom';
import * as actions from "../store/actions/auth";
import { connect } from 'react-redux';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class CustomLayout extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Link to="/markets/">
                <Icon type="pie-chart" />
                <span>Markets</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/proposals/">
                <Icon type="desktop" />
                <span>Proposals</span>
              </Link>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />
                  <span>User</span>
                </span>
              }
            >
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="team" />
                  <span>Team</span>
                </span>
              }
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header className="header">
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
          {
            this.props.isAuthenticated ?

                <Menu.Item key="3" onClick={this.props.logout}>
                    Logout
                </Menu.Item>

                :

                <Menu.Item key="3">
                    <Link to="/login">Login</Link>
                </Menu.Item>
          }
        <Menu.Item key="1">Coming soon</Menu.Item>
        <Menu.Item key="2">Coming soon</Menu.Item>
        
      </Menu>
    </Header>
          {/*<Header style={{ background: '#fff', padding: 0 }} />*/}
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
              <Breadcrumb.Item><Link to="/markets/">Markets</Link></Breadcrumb.Item>
              <Breadcrumb.Item><Link to="/proposals/">Proposals</Link></Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2019 Created by Alex Crim</Footer>
        </Layout>
      </Layout>
    );
  }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
};

export default withRouter(connect(null, mapDispatchToProps)(CustomLayout));

