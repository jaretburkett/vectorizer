const resizeCanvas = (canvas, width, height) => {
  // create a temp canvas to hold the source image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);

  // resize and clear canvas
  canvas.height = height;
  canvas.width = width;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

  // cleanup
  tempCanvas.remove();

  return canvas;
};

export default resizeCanvas;
