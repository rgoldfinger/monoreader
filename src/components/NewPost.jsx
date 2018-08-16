import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PostsActions from '../actions/PostsActions';
import S3Uploader from '../libs/S3Uploader';
import './__styles__/NewPost.css';

var NewPost = createReactClass({
  propTypes: {
    submitAction: PropTypes.func.isRequired,
    imageUpload: PropTypes.bool,
    handleCancel: PropTypes.func,
    customAction: PropTypes.object,
  },

  handleSubmit(e) {
    e.preventDefault();
    var entryText = this.refs.text.value;
    if (entryText) {
      this.props.submitAction(entryText);
      this.refs.text.value = '';
    }
  },

  checkSubmit(e) {
    if (e.keyCode === 13 && e.ctrlKey) {
      this.handleSubmit(e);
    }
  },

  handleImageUpload(signingData) {
    this.refs.text.value =
      this.refs.text.value +
      '<img src="https://liveblogphotos2.s3-us-west-2.amazonaws.com/' +
      signingData.filename +
      '" class="post-image"></img>';
  },

  onCancel(e) {
    if (this.props.handleCancel) {
      this.props.handleCancel();
    }
  },

  renderCancel() {
    return (
      <div className="hyperbutton" onClick={() => this.onCancel()}>
        Cancel
      </div>
    );
  },

  handleCustom(e) {
    e.preventDefault();
    var entryText = this.refs.text.value;
    if (entryText) {
      this.props.customAction.action(entryText);
      this.refs.text.value = '';
    }
  },

  renderCustom() {
    return (
      <div onClick={() => this.handleCustom()} className="hyperbutton">
        {this.props.customAction.label}
      </div>
    );
  },

  render() {
    return (
      <div className="NewPost">
        <form className="body-text text-area flex-right" role="form">
          <textarea className="card" onKeyDown={() => this.checkSubmit()} ref="text" />
        </form>
        <div className="flex-right">
          {this.props.imageUpload && <S3Uploader onFinish={() => this.handleImageUpload()} />}
          {this.props.handleCancel && this.renderCancel()}
          {this.props.customAction && this.renderCustom()}
          <div
            style={{ color: '#c41a18' }}
            className="hyperbutton"
            onClick={() => this.handleSubmit()}
          >
            Comment
          </div>
        </div>
      </div>
    );
  },
});

export default NewPost;
