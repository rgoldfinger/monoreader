import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import UserBox from './UserBox';
import LoginStore from '../stores/LoginStore';
import API from '../helpers/ApiHelper';

var Event = createReactClass({
  propTypes: {
    event: PropTypes.object.isRequired
  },

  render() {
    return (
      <div className="row card post">
        <Link to={'write'} params={{eventId: this.props.event._id}}>
          {this.props.event.eventTitle}
        </Link>
        <span>{this.props.event.eventIsLive ? 'Live' : 'Ended'}</span>
      </div>
    );
  }
});

var NewEvent = createReactClass({
  contextTypes: {
    router: PropTypes.func
  },

  create() {
    var title = this.refs.title.getDOMNode().value;
    if (title) {
      API('POST', 'event', {eventTitle: title}, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        //TODO send admin users
        this.context.router.transitionTo('write', {eventId: data._id});
      });
    }
  },

  render() {
    return (
      <div>
        <div className="row card post flex-box">
          <div>Create New Event:</div>
          <input ref="title" placeholder="Event Name" style={{margin: "0 12px"}} className="flex-1"/>
          <div className="hyperbutton" onClick={this.create}>Create</div>
        </div>
      </div>
    );
  }
});

var EventsList = createReactClass({

  statics: {
    getStateFromStores() {
      return {
        user: LoginStore.getCurrentUser()
      };
    }
  },

  getInitialState() {
    return EventsList.getStateFromStores();
  },

  componentWillMount() {
    window.document.title = "ReadItLive.net";
  },

  componentDidMount() {
    API('GET', 'event', {}, (err, data) => {
      this.setState({data: R.reverse(data)});
    });
    LoginStore.addChangeListener(this.handleStoreChange);
  },

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.handleStoreChange);
  },

  handleStoreChange() {
    this.setState(EventsList.getStateFromStores());
  },

  render() {
    var events;
    if (this.state.data) {
      events = this.state.data.map((event, i) =>
          <Event event={event} key={i}/>);
    }

    return (
      <div className="ril-container">
        <span>hi</span>
        <div className="flex-right">
          <UserBox user={this.state.user}/>
        </div>
        {this.state.user && <NewEvent />}
        {events}
      </div>
    );
  }
});

export default EventsList;
