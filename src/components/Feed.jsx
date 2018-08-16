import React from 'react';
import PropTypes from 'prop-types';

import Post from './Post';

class Feed extends React.Component {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    postsData: PropTypes.array.isRequired,
  };

  render() {
    var postNodes;
    if (this.props.postsData) {
      postNodes = this.props.postsData.map((post, i) => {
        return <Post post={post} isAdmin={this.props.isAdmin} key={i} />;
      });
    }

    return <div className="ril-container flex-1">{postNodes}</div>;
  }
}

export default Feed;
