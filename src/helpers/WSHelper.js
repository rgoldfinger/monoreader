import SockJS from 'sockjs-client';
import PostsStore from '../stores/PostsStore';
import EventStore from '../stores/EventStore';
import LoginStore from '../stores/LoginStore';

var sock;
var reconnect;

var WSHelper = {
  connect(eventId, callback) {
    sock = new SockJS('http://readitlive.net:3080/ws');
    reconnect = true;
    sock.onmessage = function(e) {
        callback(JSON.parse(e.data));
    };

    sock.onerror = function(err) {
      console.log('socket error: ', err);
    };
    sock.onopen = function() {
      sock.send(JSON.stringify({
        eventId: eventId,
        userId: LoginStore.getCurrentUser() && LoginStore.getCurrentUser()._id
      }));
    };
    sock.onclose = function() {
      if (reconnect && EventStore.eventIsLive()) {
        setTimeout(() => {
          PostsStore.init(eventId);
          WSHelper.connect(eventId, callback);
        }, 5000);
      }
    };
  },

  send(post) {
    sock.send(JSON.stringify(post));
  },
  close() {
    reconnect = false;
    sock.close();
  }
};

export default WSHelper;
