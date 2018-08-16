// https://github.com/odysseyscience/react-s3-uploader
import React from 'react';
import S3Upload from './s3upload';

class Uploader extends React.Component {
  uploadFile = e => {
    e.stopPropagation();
    new S3Upload({
      size: this.props.size,
      fileElement: this.refs.fileInput,
      onProgress:
        this.props.onProgress ||
        function(percent, message) {
          console.log('Upload progress: ' + percent + '% ' + message);
        },
      onFinishS3Put:
        this.props.onFinish ||
        function(signResult) {
          console.log('Upload finished: ' + signResult.publicUrl);
        },
      onError:
        this.props.onError ||
        function(message) {
          console.log('Upload error: ' + message);
        },
    });
  };

  render() {
    return (
      <input
        type="file"
        ref="fileInput"
        onChange={this.uploadFile}
        onClick={e => e.stopPropagation()}
      />
    );
  }
}

// var ReactS3Uploader = createReactClass({
//   displayName: 'ReactS3Uploader',
//
//   propTypes: {
//     onProgress: PropTypes.func,
//     onFinish: PropTypes.func,
//     onError: PropTypes.func,
//     size: PropTypes.number,
//   },
//
//   getDefaultProps: function() {
//     return {
//       onProgress: function(percent, message) {
//         console.log('Upload progress: ' + percent + '% ' + message);
//       },
//       onFinish: function(signResult) {
//         console.log('Upload finished: ' + signResult.publicUrl);
//       },
//       onError: function(message) {
//         console.log('Upload error: ' + message);
//       },
//     };
//   },
//
//   uploadFile: function(e) {
//     e.stopPropagation();
//     new S3Upload({
//       size: this.props.size,
//       fileElement: this.getDOMNode(),
//       onProgress: this.props.onProgress,
//       onFinishS3Put: this.props.onFinish,
//       onError: this.props.onError,
//     });
//   },
//
//   render: function() {
//     return <input type="file" onChange={this.uploadFile} onClick={e => e.stopPropagation()} />;
//     // // return ReactDOM.input(objectAssign({}, this.props, {
//     // type: 'file',
//     // onChange: this.uploadFile,
//     // onClick: }
//   },
// });

export default Uploader;
