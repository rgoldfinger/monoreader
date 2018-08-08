import constants from '../constants/constants';
import AppDispatcher from '../dispatchers/appDispatcher';
import ApiHelper from '../helpers/ApiHelper';
import LoginStore from '../stores/LoginStore';

var LoginActionsCreators = {
  loginUser(username, password) {
    var data;
    data = {
      username: username,
      password: password
    };
    return ApiHelper('POST', 'auth/login', data, LoginActionsCreators.receiveUserLogin);
  },
  signupUser(username, password) {
    var data;
    data = {
      username: username,
      password: password
    };
    return ApiHelper('POST', 'auth/signup', data, LoginActionsCreators.receiveUserLogin);
  },
  updateAvatar(signingData) {
    var avatarUrl =
      'https://liveblogphotos2.s3-us-west-2.amazonaws.com/' + signingData.filename;
    var user = LoginStore.getCurrentUser();
    user.profile = user.profile || {};
    user.profile.avatarUrl = avatarUrl;

    return ApiHelper('PUT', 'auth/user', user, LoginActionsCreators.receiveUser);
  },
  logoutUser() {
    return AppDispatcher.handleServerAction({
      actionType: constants.LOGOUT_USER
    });
  },
  receiveUser(error, data) {
    return AppDispatcher.handleServerAction({
      actionType: constants.RECEIVE_USER,
      user: data
    });
  },
  receiveUserLogin(error, data) {
    if (error && data.responseText) {
      try {
        data = JSON.parse(data.responseText);
        return AppDispatcher.handleServerAction({
          actionType: constants.RECEIVE_LOGIN_ERROR,
          message: data.message
        });
      } catch (e) {
        data = {};
      }
    } else {
      return AppDispatcher.handleServerAction({
        actionType: constants.RECEIVE_LOGIN_USER,
        user: data.user,
        token: data.token,
        exp: data.expires
      });
    }
  }
};

export default LoginActionsCreators;
