const trimWhiteSpace = (canvas, trimAlphaOnly = false) => {
  // inspired by https://stackoverflow.com/a/22267731

  const ctx = canvas.getContext('2d');
  let w = canvas.width;
  let h = canvas.height;
  const pix = { x: [], y: [] };
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let index;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (trimAlphaOnly) {
        if (imageData.data[index + 3] > 0) {
          // is not transparent
          pix.x.push(x);
          pix.y.push(y);
        }
      } else {
        // trim for white color or transparent
        if (
          imageData.data[index + 3] > 0 ||
          imageData.data[index + 0] < 255 ||
          imageData.data[index + 1] < 255 ||
          imageData.data[index + 2] < 255
        ) {
          // is not white
          pix.x.push(x);
          pix.y.push(y);
        }
      }
    }
  }
  pix.x.sort((a, b) => {
    return a - b;
  });
  pix.y.sort((a, b) => {
    return a - b;
  });
  const n = pix.x.length - 1;

  w = 1 + pix.x[n] - pix.x[0];
  h = 1 + pix.y[n] - pix.y[0];
  const cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

  canvas.width = w;
  canvas.height = h;
  ctx.putImageData(cut, 0, 0);
  return canvas;
};

export default trimWhiteSpace;
