import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import * as R from 'ramda';

// var LoginStore = require('../stores/LoginStore');
import PostsStore from '../stores/PostsStore';

import EventStore from '../stores/EventStore';
import LoginStore from '../stores/LoginStore';
import CommentsActions from '../actions/CommentsActions';
import PostsActions from '../actions/PostsActions';
import SocketActions from '../actions/SocketActions';
import WSHelper from '../helpers/WSHelper';
import TopBar from './TopBar';
import NewPost from './NewPost';
import Feed from './Feed';
import CommentsDisplay from './CommentsDisplay';
import './__styles__/App.styl';

var WriteApp = createReactClass({
  statics: {
    getStateFromStores() {
      return {
        event: EventStore.getEvent(),
        user: LoginStore.getCurrentUser(),
        isAdmin: LoginStore.userIsAdmin(EventStore.getEvent()),
        postsData: PostsStore.getPosts()
      };
    }
  },

  getInitialState() {
    return WriteApp.getStateFromStores();
  },

  componentWillMount() {
    var eventId = this.props.match.params.eventId;
    this.setState({eventId});
    EventStore.init(eventId);
    PostsStore.init(eventId);
    WSHelper.connect(eventId, SocketActions.receiveUpdate);
  },

  componentDidMount() {
    EventStore.addChangeListener(this.handleStoreChange);
    LoginStore.addChangeListener(this.handleStoreChange);
    PostsStore.addChangeListener(this.handleStoreChange);
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextState.event._id !== this.state.event._id) {
      window.document.title = nextState.event.eventTitle;
    }

  },

  componentDidUpdate() {
    var eventId = this.props.match.params.eventId;
    if (eventId !== this.state.eventId) {
      this.setState({eventId});
      EventStore.init(eventId);
      PostsStore.init(eventId);
    }
  },

  componentWillUnmount() {
    EventStore.removeChangeListener(this.handleStoreChange);
    LoginStore.removeChangeListener(this.handleStoreChange);
    PostsStore.removeChangeListener(this.handleStoreChange);
    WSHelper.close();
  },

  handleStoreChange() {
    this.setState(WriteApp.getStateFromStores());
  },

  render() {
    var isAdmin = LoginStore.userIsAdmin(this.state.event);

    return (
      <div>
        <TopBar event={this.state.event} user={this.state.user} isAdmin={this.state.isAdmin}/>
        {this.state.user &&
          <NewPost
            imageUpload={isAdmin}
            submitAction={isAdmin ? PostsActions.submit : CommentsActions.submit}
            customAction={isAdmin ? {label: "<Embed>", action: (postText) => PostsActions.submit(postText, true)} : {}}/>
        }
        <div className="flex-box">
          <Feed isAdmin={this.state.isAdmin} postsData={this.state.postsData}/>
          {isAdmin && <CommentsDisplay />}
        </div>
      </div>
    );
  }
});

export default WriteApp;
