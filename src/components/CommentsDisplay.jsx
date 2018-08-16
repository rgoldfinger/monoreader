import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import CommentsStore from '../stores/CommentsStore';
import CommentsActions from '../actions/CommentsActions';
import constants from '../constants/constants';
import './__styles__/CommentsDisplay.css';

var CommentEntry = createReactClass({
  propTypes: {
    comment: PropTypes.object.isRequired,
  },

  handleDelete(e) {
    e.stopPropagation();
    CommentsActions.delete(this.props.comment);
  },

  handlePost(e) {
    e.stopPropagation();
    CommentsActions.submitCommentAsPost(this.props.comment);
  },

  render() {
    var avatar = this.props.comment.avatarUrl || constants.Default_Avatar;

    return (
      <div className="CommentEntry">
        <div className="flex-right">
          <div onClick={() => this.handleDelete()} className="hyperbutton">
            Delete
          </div>
          <div onClick={() => this.handlePost()} className="hyperbutton">
            Post
          </div>
        </div>
        <div className="flex-start">
          <img src={avatar} height="40" width="40" />
          <div className="card comment-text">
            <div className="author-name">{this.props.comment.author}:</div>
            {this.props.comment.postText}
          </div>
        </div>
      </div>
    );
  },
});

var CommentsDisplay = createReactClass({
  contextTypes: {
    router: PropTypes.object,
  },

  getInitialState() {
    return {
      comments: CommentsStore.getComments(),
    };
  },

  componentDidMount() {
    CommentsStore.addChangeListener(this.onStoreChange);
    CommentsStore.init(this.context.router.route.match.params.eventId);
  },

  componentWillUnmount() {
    CommentsStore.removeChangeListener(this.onStoreChange);
  },

  onStoreChange() {
    this.setState({ comments: CommentsStore.getComments() });
  },

  renderComment(comment, i) {
    return <CommentEntry comment={comment} isAdmin={this.props.isAdmin} key={i} />;
  },

  render() {
    return (
      <div className="CommentsDisplay">
        {this.state.comments && this.state.comments.map(this.renderComment)}
      </div>
    );
  },
});

export default CommentsDisplay;
