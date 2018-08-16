import constants from '../constants/constants';
import AppDispatcher from '../dispatchers/appDispatcher';
import API from '../helpers/ApiHelper';

var EventActions = {
  receiveEvent(err, data) {
    return AppDispatcher.handleServerAction({
      actionType: constants.RECEIVE_EVENT,
      event: data,
    });
  },

  toggleLive(event) {
    event.eventIsLive = !event.eventIsLive;
    API('PUT', 'event/' + event._id, event, EventActions.receiveEvent);
    return AppDispatcher.handleViewAction({
      actionType: constants.EVENT_LIVE_TOGGLE,
      event: event,
    });
  },
  delete(event, callback) {
    API('DELETE', 'event/' + event._id, event, callback);
  },
};

export default EventActions;
