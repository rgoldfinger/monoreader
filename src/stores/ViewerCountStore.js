import assign from 'object-assign';
import { EventEmitter } from 'events';
import * as R from 'ramda';
import AppDispatcher from '../dispatchers/appDispatcher';
import WSHelper from '../helpers/WSHelper';
import API from '../helpers/ApiHelper';
import constants from '../constants/constants';
import PostsActions from '../actions/PostsActions';

var CHANGE_EVENT = 'change';

var _count = 0;

var ViewerCountStore = assign({}, EventEmitter.prototype, {
  init: function(eventId) {
    _count = 0;
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
  getViewerCount: function() {
    return _count;
  }
});

ViewerCountStore.dispatcherToken = AppDispatcher.register(function(payload) {
  var action;
  action = payload.action;
  switch (action.actionType) {
    case constants.UPDATE_VIEWER_COUNT:
      _count = action.data.viewerCount
      ViewerCountStore.emitChange();
      break;
  }
  return true;
});

export default ViewerCountStore;
