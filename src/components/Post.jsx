import React from 'react';
import PropTypes from 'prop-types';
import constants from '../constants/constants';
import NewPost from './NewPost';
import PostsActions from '../actions/PostsActions';

import './__styles__/Post.css';

class PostMeta extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    var avatar = this.props.post.avatarUrl || constants.Default_Avatar;
    return (
      <div className="metadata-area">
        <img
          className="img-responsive avatar-pic"
          height="80"
          width="80"
          src={avatar}
          alt="avater"
        />
        <p className="meta meta-time">{this.props.post.timeEU}</p>
      </div>
    );
  }
}

class PostText extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="body-text card flex-1" style={{ marginRight: '8px' }}>
        <div className="author-name">{this.props.post.author}:</div>
        <div
          dangerouslySetInnerHTML={{
            __html: this.props.post.postText || this.props.post.replyText,
          }}
        />
      </div>
    );
  }
}

class AdminArea extends React.Component {
  static propTypes = {
    editing: PropTypes.bool,
    handleReply: PropTypes.func,
    handleDelete: PropTypes.func,
    handleEdit: PropTypes.func,
    handleEditCancel: PropTypes.func,
    handleEditSubmit: PropTypes.func,
  };

  render() {
    if (this.props.editing) {
      return (
        <div className="flex-right">
          {this.props.handleEditCancel && (
            <div className="hyperbutton" onClick={this.props.handleEditCancel}>
              Cancel
            </div>
          )}
          {this.props.handleEditSubmit && (
            <div className="hyperbutton" onClick={this.props.handleEditSubmit}>
              Save
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex-right">
          {this.props.handleReply && (
            <div className="hyperbutton" onClick={this.props.handleReply}>
              Reply
            </div>
          )}
          {this.props.handleDelete && (
            <div className="hyperbutton" onClick={this.props.handleDelete}>
              Delete
            </div>
          )}
          {this.props.handleEdit && (
            <div className="hyperbutton" onClick={this.props.handleEdit}>
              Edit
            </div>
          )}
        </div>
      );
    }
  }
}

class Editor extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  state = {
    text: this.props.post.postText,
  };

  handleSubmit = e => {
    e.preventDefault();
    var entryText = this.refs.text.value;
    if (entryText) {
      this.props.handleSubmit(entryText);
    }
  };

  handleChange = e => {
    this.setState({ text: e.target.value });
  };

  checkSubmit = e => {
    if (e.keyCode === 13 && e.ctrlKey) {
      this.handleSubmit(e);
    }
  };

  render() {
    return (
      <div className="body-text">
        <form className="body-text text-area">
          <textarea
            value={this.state.text}
            onKeyDown={this.checkSubmit}
            onChange={this.handleChange}
            ref="text"
          />
        </form>
      </div>
    );
  }
}

class Reply extends React.Component {
  static propTypes = {
    reply: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
  };

  state = {
    editing: false,
  };

  handleDelete = () => {
    PostsActions.deleteReply(this.props.post, this.props.index);
  };

  handleEditSubmit = () => {
    var replyText = this.refs.editor.refs.text.value;
    this.props.reply.postText = replyText; //HACK
    PostsActions.editReply(this.props.post, this.props.reply, this.props.index);
    this.setState({ editing: false });
  };

  renderEditor = () => {
    return (
      <div className="post-admin flex-box">
        <Editor
          post={this.props.reply}
          handleCancel={() => this.setState({ editing: false })}
          handleSubmit={this.handleEditSubmit}
          ref="editor"
        />
      </div>
    );
  };

  render() {
    var adminArea = (
      <AdminArea
        handleEdit={() => this.setState({ editing: true })}
        handleEditSubmit={this.handleEditSubmit}
        handleEditCancel={() => this.setState({ editing: false })}
        handleDelete={this.handleDelete}
        editing={this.state.editing}
      />
    );

    var reply = <PostText post={this.props.reply} />;
    return (
      <div className="reply" style={{ marginTop: '20px' }}>
        {this.props.isAdmin && adminArea}
        <div className="flex-box">
          <PostMeta post={this.props.reply} />
          {!this.state.editing ? reply : this.renderEditor()}
        </div>
      </div>
    );
  }
}

class Post extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  };

  state = {
    editing: false,
    replying: false,
  };

  renderReplies = () => {
    var replyEntry = (reply, i) => {
      return (
        <Reply
          reply={reply}
          post={this.props.post}
          key={i}
          index={i}
          isAdmin={this.props.isAdmin}
        />
      );
    };

    return <div style={{ marginLeft: '100px' }}>{this.props.post.replies.map(replyEntry)}</div>;
  };

  handleDelete = () => {
    PostsActions.delete(this.props.post);
  };

  handleEditSubmit = () => {
    var entry = this.refs.editor.refs.text.value;
    PostsActions.update(this.props.post._id, entry, () => this.setState({ editing: false }));
  };

  renderEditor = () => {
    return (
      <div className="post-admin flex-box">
        <Editor
          post={this.props.post}
          handleCancel={() => this.setState({ editing: false })}
          handleSubmit={this.handleEditSubmit}
          ref="editor"
        />
      </div>
    );
  };

  submitReply = replyText => {
    PostsActions.reply(this.props.post, replyText);
    this.setState({ replying: false });
  };

  renderReplyEditor = () => {
    return (
      <div style={{ marginRight: '8%' }}>
        <NewPost
          submitAction={this.submitReply}
          handleCancel={() => this.setState({ replying: false })}
        />
      </div>
    );
  };

  render() {
    var post = <PostText post={this.props.post} />;

    var adminArea = (
      <AdminArea
        handleEdit={() => this.setState({ editing: true })}
        handleEditSubmit={this.handleEditSubmit}
        handleEditCancel={() => this.setState({ editing: false })}
        handleReply={() => this.setState({ replying: true })}
        handleDelete={this.handleDelete}
        editing={this.state.editing}
      />
    );

    return (
      <div className="post">
        {this.props.isAdmin && adminArea}
        <div className="flex-box">
          <PostMeta post={this.props.post} />
          {!this.state.editing ? post : this.renderEditor()}
        </div>
        {this.props.post.replies && this.renderReplies()}
        {this.state.replying && this.renderReplyEditor()}
      </div>
    );
  }
}

export default Post;
