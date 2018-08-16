// From:
// http://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality
var resizeCanvasImage = function(img, maxWidth, maxHeight) {
  var imgWidth = img.width,
    imgHeight = img.height;

  var ratio = 1,
    ratio1 = 1,
    ratio2 = 1;
  ratio1 = maxWidth / imgWidth;
  ratio2 = maxHeight / imgHeight;

  // Use the smallest ratio that the image best fit into the maxWidth x maxHeight box.
  if (ratio1 < ratio2) {
    ratio = ratio1;
  } else {
    ratio = ratio2;
  }

  var canvas = document.createElement('canvas');
  var canvasContext = canvas.getContext('2d');
  var canvasCopy = document.createElement('canvas');
  var copyContext = canvasCopy.getContext('2d');
  var canvasCopy2 = document.createElement('canvas');
  var copyContext2 = canvasCopy2.getContext('2d');
  canvasCopy.width = imgWidth;
  canvasCopy.height = imgHeight;
  copyContext.drawImage(img, 0, 0);

  // init
  canvasCopy2.width = imgWidth;
  canvasCopy2.height = imgHeight;
  copyContext2.drawImage(
    canvasCopy,
    0,
    0,
    canvasCopy.width,
    canvasCopy.height,
    0,
    0,
    canvasCopy2.width,
    canvasCopy2.height,
  );

  var rounds = 2;
  var roundRatio = ratio * rounds;
  for (var i = 1; i <= rounds; i++) {
    console.log('Step: ' + i);

    // tmp
    canvasCopy.width = (imgWidth * roundRatio) / i;
    canvasCopy.height = (imgHeight * roundRatio) / i;

    copyContext.drawImage(
      canvasCopy2,
      0,
      0,
      canvasCopy2.width,
      canvasCopy2.height,
      0,
      0,
      canvasCopy.width,
      canvasCopy.height,
    );

    // copy back
    canvasCopy2.width = (imgWidth * roundRatio) / i;
    canvasCopy2.height = (imgHeight * roundRatio) / i;
    copyContext2.drawImage(
      canvasCopy,
      0,
      0,
      canvasCopy.width,
      canvasCopy.height,
      0,
      0,
      canvasCopy2.width,
      canvasCopy2.height,
    );
  } // end for

  // copy back to canvas
  canvas.width = (imgWidth * roundRatio) / rounds;
  canvas.height = (imgHeight * roundRatio) / rounds;
  canvasContext.drawImage(
    canvasCopy2,
    0,
    0,
    canvasCopy2.width,
    canvasCopy2.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return canvas.toDataURL('image/jpeg', 0.8);
};

// var img = document.createElement("img");
// img.src = window.URL.createObjectURL(file);

// img.onload = function() {
//     var canvas = document.createElement("canvas");
//     new thumbnailer(canvas, img, 188, 3); //this produces lanczos3
//     // but feel free to raise it up to 8. Your client will appreciate
//     // that the program makes full use of his machine.
//     document.body.appendChild(canvas);
// };

exports.loadAndResize = function(file, size, callback) {
  var img = document.createElement('img');
  img.src = window.URL.createObjectURL(file);

  img.onload = function() {
    callback(resizeCanvasImage(img, size, size));
  };
};
