import assign from 'object-assign';
import { EventEmitter } from 'events';
import * as R from 'ramda';
import AppDispatcher from '../dispatchers/appDispatcher';
import API from '../helpers/ApiHelper';
import constants from '../constants/constants';
import CommentsActions from '../actions/CommentsActions';

var CHANGE_EVENT = 'change';

var _comments = [];

var CommentsStore = assign({}, EventEmitter.prototype, {
  init: function(eventId) {
    _comments = [];
    API('GET', 'event/' + eventId + '/comment', {}, CommentsActions.receiveComments);
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
  getComments: function() {
    if (_comments.length) {
      var sortedComments = R.sortBy(function(e) {
        return new Date(e.time).valueOf();
      }, _comments);
      return R.reverse(sortedComments);
    }
    return [];
  },
});

CommentsStore.dispatcherToken = AppDispatcher.register(function(payload) {
  var action;
  action = payload.action;
  switch (action.actionType) {
    case constants.RECEIVE_COMMENTS:
      _comments = _comments.concat(action.data);
      CommentsStore.emitChange();
      break;
    case constants.RECEIVE_COMMENT:
      _comments.push(action.data.comment);
      CommentsStore.emitChange();
      break;
    case constants.DELETE_COMMENT:
      var index = R.findIndex(R.propEq('_id', action.commentId))(_comments);
      _comments = R.remove(index, 1, _comments);
      CommentsStore.emitChange();
      break;
    // case constants.PUT_POST:
    //   var index = R.findIndex(R.propEq('_id', action.data.entryId))(_comments);
    //   _comments[index] = action.data.entry;
    //   CommentsStore.emitChange();
    //   break;
    default:
      break;
  }
  return true;
});

export default CommentsStore;
