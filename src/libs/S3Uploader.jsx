// https://github.com/odysseyscience/react-s3-uploader
var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var S3Upload = require('./s3upload.js');
var objectAssign = require('object-assign');

var ReactS3Uploader = createReactClass({

    propTypes: {
        onProgress: PropTypes.func,
        onFinish: PropTypes.func,
        onError: PropTypes.func,
        size: PropTypes.number
    },

    getDefaultProps: function() {
        return {
            onProgress: function(percent, message) {
                console.log('Upload progress: ' + percent + '% ' + message);
            },
            onFinish: function(signResult) {
                console.log("Upload finished: " + signResult.publicUrl)
            },
            onError: function(message) {
                console.log("Upload error: " + message);
            }
        };
    },

    uploadFile: function(e) {
      e.stopPropagation();
      new S3Upload({
        size: this.props.size,
        fileElement: this.getDOMNode(),
        onProgress: this.props.onProgress,
        onFinishS3Put: this.props.onFinish,
        onError: this.props.onError
      });
    },

    render: function() {
      return (<input type="file" onChange={this.uploadFile} onClick={(e) => e.stopPropagation()}>

      </input>);
      // // return ReactDOM.input(objectAssign({}, this.props, {
      // type: 'file',
      // onChange: this.uploadFile,
      // onClick: }
    }

});


export default ReactS3Uploader;
