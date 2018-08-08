import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Link, Navigation } from 'react-router-dom';
import UserBox from './UserBox';
import ViewerCountStore from '../stores/ViewerCountStore';
import EventActions from '../actions/EventActions';
import './__styles__/TopBar.styl';

var TopBar = createReactClass({
  propTypes: {
    event: PropTypes.object,
    user: PropTypes.object,
    isAdmin: PropTypes.bool.isRequired
  },

  getInitialState() {
    return {
      viewerCount: 0,
      liveMenu: false
    };
  },

  getDefaultProps() {
    return {event: {}};
  },

  componentDidMount() {
    ViewerCountStore.addChangeListener(this.checkStores);
  },
  componentWillUnmount() {
    ViewerCountStore.removeChangeListener(this.checkStores);
  },
  checkStores() {
    this.setState({
      viewerCount: ViewerCountStore.getViewerCount()
    });
  },

  toggleLive() {
    EventActions.toggleLive(this.props.event);
  },

  deleteEvent() {
    if (window.confirm('Are you sure you want to delete this event?')) {
      EventActions.delete(this.props.event, this.transitionTo.bind(this, 'events'));
    }
  },

  toggleMenu() {
    this.setState({liveMenu: !this.state.liveMenu});
  },

  renderLiveToggle(statusText) {
    var menu = (
      <div className="nav-dropdown flex-box">
        <div onClick={this.toggleLive} className="hyperbutton">{this.props.event.eventIsLive ? 'End Event' : 'Start Event'}</div>
        <div onClick={this.deleteEvent} className="hyperbutton">Delete Event</div>
      </div>
    );

    return (
      <div onClick={this.toggleMenu} className="hyperbutton navbar-text">
        {statusText + ' — Event settings'}
        {this.state.liveMenu && menu}
      </div>
    );
  },

  render() {
    var isLive = this.props.event.eventIsLive ? 'Live' : 'Event Ended';
    return (
      <nav className="card TopBar" role="navigation">
        <Link to="events" className="navbar-brand">Live Update Guy</Link>
        <div className="navbar-text flex-1">{this.props.event.eventTitle}</div>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" className="navbar-text paypal-button" target="_blank">
          <input type="hidden" name="cmd" value="_donations" />
          <input type="hidden" name="business" value="charles@pelkey.com" />
          <input type="hidden" name="lc" value="US" />
          <input type="hidden" name="item_name" value="Charles Pelkey" />
          <input type="hidden" name="no_note" value="0" />
          <input type="hidden" name="currency_code" value="USD" />
          <input type="hidden" name="bn" value="PP-DonationsBF:btn_donateCC_LG.gif:NonHostedGuest" />
          <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
          <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
        </form>
        {this.props.isAdmin ? this.renderLiveToggle(isLive) : <div className="navbar-text">{isLive}</div>}
        {this.props.isAdmin && <div className="navbar-text">Reader Count: {this.state.viewerCount}</div>}
        <UserBox user={this.props.user}/>
      </nav>
    );
  }
});


export default TopBar;
