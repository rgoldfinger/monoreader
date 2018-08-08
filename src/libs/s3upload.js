// https://github.com/odysseyscience/react-s3-uploader


/**
 * Taken, CommonJS-ified, and heavily modified from:
 * https://github.com/flyingsparx/NodeDirectUploader
 */

import API from '../helpers/ApiHelper';

import imageresize from './imageresize';

S3Upload.prototype.fileElement = null;

S3Upload.prototype.onFinishS3Put = function(signResult) {
    return console.log('base.onFinishS3Put()', signResult.publicUrl);
};

S3Upload.prototype.onProgress = function(percent, status) {
    return console.log('base.onProgress()', percent, status);
};

S3Upload.prototype.onError = function(status) {
    return console.log('base.onError()', status);
};

function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

function S3Upload(options) {
    if (options === null) {
        options = {};
    }
    for (var option in options) {
        if (options.hasOwnProperty(option)) {
            this[option] = options[option];
        }
    }
    var file = this.handleFileSelect(options.fileElement);
    if (options.size) {
      imageresize.loadAndResize(file, options.size, (dataUri) => {
        var blob = dataURItoBlob(dataUri);
        this.getSignedUrl(blob, file.name);
      });
    } else {
      this.getSignedUrl(file, file.name);
    }
}

S3Upload.prototype.getSignedUrl = function(file, filename) {
  API('POST', 'sign', {filename: filename}, (err, data) => {
    this.signingData = data;
    this.uploadToS3(file, filename);
  });
};

S3Upload.prototype.handleFileSelect = function(fileElement) {
    this.onProgress(0, 'Upload started.');
    return fileElement.files[0];
};

S3Upload.prototype.createCORSRequest = function(method, url) {
    var xhr = new XMLHttpRequest();

    if (xhr.withCredentials != null) {
        xhr.open(method, url, true);
    }
    else if (typeof XDomainRequest !== "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    }
    else {
        xhr = null;
    }
    return xhr;
};

S3Upload.prototype.uploadToS3 = function(file) {
    var xhr = this.createCORSRequest('PUT', this.signingData.signedUrl);
    if (!xhr) {
        this.onError('CORS not supported');
    } else {
        xhr.onload = function() {
            if (xhr.status === 200) {
                this.onProgress(100, 'Upload completed.');
                return this.onFinishS3Put(this.signingData);
            } else {
                return this.onError('Upload error: ' + xhr.status);
            }
        }.bind(this);
        xhr.onerror = function() {
            return this.onError('XHR error.');
        }.bind(this);
        xhr.upload.onprogress = function(e) {
            var percentLoaded;
            if (e.lengthComputable) {
                percentLoaded = Math.round((e.loaded / e.total) * 100);
                return this.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing.' : 'Uploading.');
            }
        }.bind(this);
    }
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    return xhr.send(file);
};

export default S3Upload;
