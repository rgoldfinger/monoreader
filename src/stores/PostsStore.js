import assign from 'object-assign';
import { EventEmitter } from 'events';
import * as R from 'ramda';
import AppDispatcher from '../dispatchers/appDispatcher';
import API from '../helpers/ApiHelper';
import constants from '../constants/constants';
import PostsActions from '../actions/PostsActions';
import EventStore from '../stores/EventStore';

var CHANGE_EVENT = 'change';

var _posts = [];

var PostsStore = assign({}, EventEmitter.prototype, {
  init: function(eventId) {
    _posts = [];
    API('GET', 'event/' + eventId + '/entry', {}, PostsActions.receivePosts);
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
  getPosts: function() {
    if (_posts.length) {
      var sortedPosts = R.sortBy(function(e) {
        return new Date(e.time).valueOf();
      }, _posts);
      if (EventStore.eventIsLive()) {
        return R.reverse(sortedPosts);
      } else {
        return sortedPosts;
      }
    }
    return [];
  }
});

PostsStore.dispatcherToken = AppDispatcher.register(function(payload) {
  var action;
  action = payload.action;
  switch (action.actionType) {
    case constants.RECEIVE_POSTS:
      _posts = _posts.concat(action.data);
      PostsStore.emitChange();
      break;
    case constants.RECEIVE_POST:
      _posts.push(action.data.entry);
      PostsStore.emitChange();
      break;
    case constants.DELETE_POST:
      var index = R.findIndex(R.propEq('_id', action.data.entryId))(_posts);
      _posts = R.remove(index, 1, _posts);
      PostsStore.emitChange();
      break;
    case constants.PUT_POST:
      var index = R.findIndex(R.propEq('_id', action.data.entryId))(_posts);
      _posts[index] = action.data.entry;
      PostsStore.emitChange();
      break;
  }
  return true;
});

export default PostsStore;
