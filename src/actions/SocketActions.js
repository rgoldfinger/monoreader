import constants from '../constants/constants';
import AppDispatcher from '../dispatchers/appDispatcher';

var SocketActionsCreators = {
  receiveUpdate(update) {
    var { method, type, data } = update;
    if (type === 'Entry' && method === 'post') {
      return AppDispatcher.handleServerAction({
        actionType: constants.RECEIVE_POST,
        data: data,
      });
    }
    if (type === 'Entry' && method === 'delete') {
      return AppDispatcher.handleServerAction({
        actionType: constants.DELETE_POST,
        data: data,
      });
    }
    if (type === 'Entry' && method === 'put') {
      return AppDispatcher.handleServerAction({
        actionType: constants.PUT_POST,
        data: data,
      });
    }
    if (type === 'ViewerCount' && method === 'put') {
      return AppDispatcher.handleServerAction({
        actionType: constants.UPDATE_VIEWER_COUNT,
        data: data,
      });
    }
    if (type === 'Comment' && method === 'post') {
      return AppDispatcher.handleServerAction({
        actionType: constants.RECEIVE_COMMENT,
        data: data,
      });
    }
    if (type === 'Comment' && method === 'delete') {
      return AppDispatcher.handleServerAction({
        actionType: constants.DELETE_COMMENT,
        commentId: data.commentId,
      });
    }
    if (type === 'Event' && method === 'put') {
      return AppDispatcher.handleServerAction({
        actionType: constants.RECEIVE_EVENT,
        event: data.event,
      });
    }
    if (type === 'System' && method === 'reload') {
      window.location.reload(true);
    }
  },
};

export default SocketActionsCreators;
