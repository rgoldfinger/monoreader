import constants from '../constants/constants';
import AppDispatcher from '../dispatchers/appDispatcher';
import EventStore from '../stores/EventStore';
import API from '../helpers/ApiHelper';
import LoginStore from '../stores/LoginStore';

var CommentsActions = {
  delete(comment) {
    API('DELETE', 'event/' + comment.eventId + '/comment/' + comment._id, {}, () => {
      return AppDispatcher.handleServerAction({
        actionType: constants.DELETE_COMMENT,
        commentId: comment._id,
      });
    });
  },

  receiveComments(err, data) {
    if (err) return console.log(err);
    return AppDispatcher.handleServerAction({
      actionType: constants.RECEIVE_COMMENTS,
      data: data,
    });
  },

  submit(postText) {
    var user = LoginStore.getCurrentUser();
    var eventId = EventStore.getEvent()._id;

    var data = {
      postText: postText,
      eventId: eventId,
      author: user.username,
      avatarUrl: user.profile && user.profile.avatarUrl,
    };
    API('POST', 'event/' + eventId + '/comment', data, () => {});
  },

  submitCommentAsPost(comment) {
    var data = {
      postText: comment.postText,
      eventId: comment.eventId,
      author: comment.author,
      avatarUrl: comment.avatarUrl,
    };

    API('POST', 'event/' + comment.eventId, data, () => {
      CommentsActions.delete(comment);
    });
  },
};

export default CommentsActions;
