import Dispatcher from './dispatcher.js';
import assign from 'object-assign';

var AppDispatcher = assign({}, Dispatcher.prototype, {
  handleViewAction: function(action){
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },
  handleServerAction: function(action) {
    this.dispatch({
      source: 'SERVER_ACTION',
      action: action
    });
  }
});

export default AppDispatcher;
