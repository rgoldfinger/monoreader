import * as R from 'ramda';
import assign from 'object-assign';
import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/appDispatcher';
import constants from '../constants/constants';

var CHANGE_EVENT = 'change';

var _currentUser;
var _authToken;
var _loginError;

var _loginUser = function(userData, authToken, exp) {
  _currentUser = userData;
  _authToken = authToken;
  window.localStorage.setItem('ril-auth-token', authToken);
  window.localStorage.setItem('ril-current-user', JSON.stringify(userData));
  if (exp) {
    window.localStorage.setItem('ril-auth-exp', exp);
  }
};

var _updateUser = function(userData) {
  _currentUser = userData;
  window.localStorage.setItem('ril-current-user', JSON.stringify(userData));
};

var _logoutUser = function() {
  _currentUser = null;
  _authToken = null;
  window.localStorage.removeItem('ril-auth-token');
  window.localStorage.removeItem('ril-current-user');
  window.localStorage.removeItem('ril-auth-exp');
};

var LoginStore = assign({}, EventEmitter.prototype, {
  init: function() {
    var authToken = window.localStorage.getItem('ril-auth-token');
    var userData;
    try {
      userData = JSON.parse(window.localStorage.getItem('ril-current-user'));
    } catch (e) {
      userData = null;
    }
    var exp = window.localStorage.getItem('ril-auth-exp');
    if (!exp || (exp && exp <= Date.now()) || !authToken || !userData || exp === 'undefined') {
      _logoutUser();
    } else {
      _currentUser = userData;
      _authToken = authToken;
    }
  },
  emitChange: function() {
    return this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    return this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    return this.removeListener(CHANGE_EVENT, callback);
  },
  getLoginError: function() {
    return _loginError;
  },
  getCurrentUser: function() {
    return _currentUser;
  },
  getAuthToken: function() {
    return _authToken;
  },
  userIsAdmin: function(event) {
    if (!_currentUser || !_currentUser.username || !event.adminUsers) return false;
    var index = R.indexOf(_currentUser.username, event.adminUsers);
    return index >= 0;
  },
});

LoginStore.dispatcherToken = AppDispatcher.register(function(payload) {
  var action;
  action = payload.action;
  switch (action.actionType) {
    case constants.RECEIVE_LOGIN_USER:
      _loginUser(action.user, action.token, action.exp);
      _loginError = null;
      LoginStore.emitChange();
      break;
    case constants.RECEIVE_USER:
      _updateUser(action.user);
      LoginStore.emitChange();
      break;
    case constants.RECEIVE_LOGIN_ERROR:
      _loginError = action.message;
      LoginStore.emitChange();
      break;
    case constants.LOGOUT_USER:
      _logoutUser();
      LoginStore.emitChange();
      break;
    default:
      break;
  }
  return true;
});

export default LoginStore;
