import React from 'react';
import createReactClass from 'create-react-class';
import LoginStore from '../stores/LoginStore';
import LoginActions from '../actions/LoginActions';
import constants from '../constants/constants';
import S3Uploader from '../libs/S3Uploader';
import './__styles__/UserBox.styl';

var UserBox = createReactClass({
  render() {
    return (
      <div className="UserArea">
        {!this.props.user ? <Login /> : <User user={this.props.user}/>}
      </div>
    );
  }
});

var Login = createReactClass({
  getInitialState() {
    return {
      expanded: false,
      signup: false,
      username: '',
      password: '',
      confirmPassword: '',
      errorMessage: LoginStore.getLoginError()
    };
  },
  componentDidMount() {
    LoginStore.addChangeListener(this.checkStores);
  },
  componentWillUnmount() {
    LoginStore.removeChangeListener(this.checkStores);
  },
  checkStores() {
    if (this.isMounted()) {
      this.setState({
        errorMessage: LoginStore.getLoginError()
      });
    }
  },

  expandToggle() {
    this.setState({
      expanded: !this.state.expanded,
      signup: false
    });
  },

  goSignup() {
    this.setState({
      signup: true
    })
  },

  goLogin() {
    this.setState({
      signup: false
    })
  },

  handleLogin() {
    var username = this.refs.username.getDOMNode().value;
    var password =  this.refs.password.getDOMNode().value;
    LoginActions.loginUser(username, password);
  },

  handleSignup() {
    var username = this.refs.username.getDOMNode().value;
    var password =  this.refs.password.getDOMNode().value;
    LoginActions.signupUser(username, password);
  },

  checkEnter(e) {
    if (e.key === 'Enter') {
      this.handleSignup();
    }
  },

  render() {
    var dropdown;
    if (this.state.expanded) {

      dropdown = (
        <div className="login-dropdown card">
          <div className="flex-container">
            <h5 className="margin-0">Login</h5>
            <div
              className="hyperbutton"
              onClick={this.goSignup}>
               Signup
            </div>
          </div>
          <span>Username:</span>
          <input
            type="email"
            ref="username" />

          <span>Password:</span>
          <input
            onKeyDown={this.checkEnter}
            ref="password"
            type="password"/>
          <div className="flex-right">
            <div
              className="hyperbutton"
              onClick={this.handleLogin}>
                Submit
            </div>
            <div
              className="hyperbutton"
              onClick={this.expandToggle}>
                Cancel
            </div>
          </div>
        {/*<button onClick={() => window.location.pathname = '/api/auth/facebook'} className="btn-facebook">Login with Facebook</button>*/}
          {this.state.errorMessage && <span style={{color: '#FF9494'}}>{this.state.errorMessage}</span>}
        </div>
      );
    }
    if (this.state.signup && this.state.expanded) {
      dropdown = (
        <div className="login-dropdown card">
        <div className="flex-container">
          <h5 className="margin-0">Signup</h5>
          <div
            className="hyperbutton"
            onClick={this.goLogin}>
             Login
          </div>
        </div>

          <div>
            <span>Username:</span>
            <input
              type="email"
              ref="username" />

            <span>Password:</span>
            <input
              ref="password"
              type="password" />

            <span>Confirm password:</span>
            <input
              onKeyDown={this.checkEnter}
              ref="password"
              type="password" />
            <div className="flex-right">
              <div
                className="hyperbutton"
                onClick={this.handleSignup}>
                  Signup
              </div>
              <div
                className="hyperbutton"
                onClick={this.expandToggle}>
                  Cancel
              </div>
            </div>
            {this.state.errorMessage && <span style={{color: '#FF9494'}}>{this.state.errorMessage}</span>}
          </div>
        </div>
      );
    }

    return (
      <div className="LoginBox">
        <div onClick={this.expandToggle} className="hyperbutton navbar-text">Sign in/up</div>
        {dropdown}
      </div>
    );

  }

});

var User = createReactClass({
  getInitialState() {
    return {
      expanded: false,
      avatarAdd: false
    };
  },

  expandToggle() {
    this.setState({
      expanded: !this.state.expanded,
      avatarAdd: false
    });
  },

  handleLogout() {
    LoginActions.logoutUser();
  },

  handleAddAvatarClick(e) {
    e.stopPropagation();
    this.setState({
      avatarAdd: true
    });
  },

  handleUploadComplete(data) {
    LoginActions.updateAvatar(data)
    this.setState({
      avatarAdd: false,
      expanded: false
    });
  },

  render() {
    var avatar = (this.props.user.profile && this.props.user.profile.avatarUrl) || constants.Default_Avatar;

    var dropdown;

    if (this.state.expanded) {

      dropdown = (
        <div className="login-dropdown">
          <div className="flex-container">
            <div
              className="hyperbutton"
              onClick={this.handleAddAvatarClick}>
                Change avatar
            </div>
            <div
              className="hyperbutton"
              onClick={this.handleLogout}>
                Logout
            </div>
            <div
              className="hyperbutton"
              onClick={this.expandToggle}>
                Cancel
            </div>

          </div>
        </div>
      );
    }

    if (this.state.avatarAdd && this.state.expanded) {
      dropdown = (
        <div className="login-dropdown card">
          <h5 className="margin-0">Upload new avatar:</h5>
          <S3Uploader size={80} onFinish={this.handleUploadComplete}/>
          <div
            className="hyperbutton"
            onClick={this.expandToggle}>
              Cancel
          </div>

        </div>
      );
    }

    return (
      <div onClick={this.expandToggle} className="UserBox">
        <img className="img-responsive nava-ava" src={avatar} />
        <div className="navbar-text navbar-user">
          <div className="username">
            {this.props.user.username}
          </div>
        </div>
        {dropdown}
      </div>
    );
  }
});

export default UserBox;
