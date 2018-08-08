import constants from '../constants/constants';
import AppDispatcher from '../dispatchers/appDispatcher';
import EventStore from '../stores/EventStore';
import API from '../helpers/ApiHelper';
import LoginStore from '../stores/LoginStore';

var PostActionsCreators = {
  receivePosts(err, data) {
    if (err) return console.log(err);
    return AppDispatcher.handleServerAction({
      actionType: constants.RECEIVE_POSTS,
      data: data
    });
  },

  receivePost(err, data) {
    if (err) return console.log(err);
    return AppDispatcher.handleServerAction({
      actionType: constants.RECEIVE_POST,
      data: data
    });
  },

  submit(postText, embed) {
    var user = LoginStore.getCurrentUser();
    var eventId = EventStore.getEvent()._id;

    if (!embed) {
      postText = postText.replace(/(www\..+?)(\s|$)/g, function(text, link) {
         return '<a href="http://'+ link +'"target="_blank">'+ link +'</a>';
      });
    } else {
      postText = '<div class="video-container">' + postText + '</div>';
    }

    var data = {
      postText: postText,
      eventId: eventId,
      postIsComment: false,
      author: user.username,
      avatarUrl: user.profile && user.profile.avatarUrl
    };
    API('POST', 'event/' + eventId, data, () => {});
  },

  update(entryId, newPostText, callback) {
    var eventId = EventStore.getEvent()._id;
    var data = {
      postText: newPostText
    };
    API('PUT', 'event/' + eventId + '/entry/' + entryId, data, callback);
  },

  delete(post) {
    API('DELETE', 'event/' + post.eventId + '/entry/' + post._id, {}, () => {});
  },

  reply(entry, replyText) {
    var user = LoginStore.getCurrentUser();
    var eventId = EventStore.getEvent()._id;
    var reply = {
      postText: replyText,
      author: user.username,
      avatarUrl: user.profile && user.profile.avatarUrl
    };
    if (entry.replies && entry.replies.length) {
      entry.replies.push(reply);
    } else {
      entry.replies = [reply];
    }

    API('PUT', 'event/' + eventId + '/entry/' + entry._id, entry, () => {});
  },

  deleteReply(entry, index) {
    var eventId = EventStore.getEvent()._id;
    entry.replies.splice(index, 1);
    API('PUT', 'event/' + eventId + '/entry/' + entry._id, entry, () => {});
  },

  editReply(entry, reply, index) {
    var eventId = EventStore.getEvent()._id;
    entry.replies[index] = reply;
    API('PUT', 'event/' + eventId + '/entry/' + entry._id, entry, () => {});
  },
};

export default PostActionsCreators;
