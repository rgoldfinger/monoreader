import React from 'react';
import PostsActions from '../actions/PostsActions';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import './__styles__/NewPost.css';

var NewPost = createReactClass({
  handleSubmit(e) {
    e.preventDefault();
    var entryText = this.refs.text.value;
    if (entryText) {
      PostsActions.submit(entryText);
    }
    this.refs.text.value = '';
  },

  checkSubmit(e) {
    if (e.keyCode === 13 && e.ctrlKey) {
      this.handleSubmit(e);
    }
  },

  render() {
    return (
      <div className="NewPost container">
        <div className="row card">
          <div className="two columns">
            <div className="hyperbutton" onClick={() => this.handleSubmit()}>
              Comment
            </div>
          </div>
          <form className="ten columns body-text text-area" role="form">
            <textarea onKeyDown={() => this.checkSubmit()} ref="text" />
          </form>
        </div>
      </div>
    );
  },
});

export default NewPost;
