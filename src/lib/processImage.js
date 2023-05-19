import ImageTracer from 'imagetracerjs';
import trimWhiteSpace from './trimWhiteSpace';
import fitInBox from './fitInBox';
import resizeCanvas from './resizeCanvas';
// import colors from './colors';
const { parse, stringify } = require('svgson');

const defaultSvgOptions = {
  scale: 2, // we process half size. Leave this 2
  blurradius: 5,
  colorsampling: 0,
  numberofcolors: 2,
  strokewidth: 0,
  pathomit: 0,
  ltres: 1,
  qtres: 8,
};

const nextFrame = () => {
  return new Promise(resolve => {
    window.requestAnimationFrame(() => {
      resolve();
    });
  });
};

function valueMap(value, fromLow, fromHigh, toLow, toHigh) {
  return toLow + ((toHigh - toLow) * (value - fromLow)) / (fromHigh - fromLow);
}

const checkIfHasTransparancy = async canvas => {
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 100) {
      return true;
    }
    if (i % 4000 == 0) {
      await nextFrame();
    }
  }
  return false;
};

const preprocessCanvas = async (canvas, config) => {
  config.statusCallback(10, 'Checking for transparancy');
  const hasTransparency = await checkIfHasTransparancy(canvas);
  if (config.trimWhiteSpace) {
    await nextFrame();
    config.statusCallback(30, 'Trimming white space');
    if (hasTransparency) {
      canvas = trimWhiteSpace(canvas, true);
    } else {
      canvas = trimWhiteSpace(canvas, false);
    }
  }
  // fit in box
  canvas = fitInBox(canvas, 3600, 3600);
  await nextFrame();
  config.statusCallback(40, 'Preprocessing image');
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  if (hasTransparency) {
    // make all non transparent image black
    for (let i = 0; i < data.length; i += 4) {
      let [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      if (a > 100) {
        imgData.data[i] = 0;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        imgData.data[i + 3] = 255;
      } else {
        imgData.data[i] = 255;
        imgData.data[i + 1] = 255;
        imgData.data[i + 2] = 255;
        imgData.data[i + 3] = 255;
      }
      if (i % 1000000 == 0) {
        const percentDone = valueMap(i, 0, data.length, 40, 70);
        config.statusCallback(percentDone, 'Preprocessing image ');
        await nextFrame();
      }
    }
  } else {
    // make color past threshold black
    for (let i = 0; i < data.length; i += 4) {
      let [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      if ((r + g + b) / 3 < 128) {
        imgData.data[i] = 0;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        imgData.data[i + 3] = 255;
      } else {
        imgData.data[i] = 255;
        imgData.data[i + 1] = 255;
        imgData.data[i + 2] = 255;
        imgData.data[i + 3] = 255;
      }
      if (i % 1000000 == 0) {
        const percentDone = valueMap(i, 0, data.length, 40, 70);
        config.statusCallback(percentDone, 'Preprocessing image ');
        await nextFrame();
      }
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imgData, 0, 0);
  config.statusCallback(70, 'Preprocessing image');
  await nextFrame();
  return canvas;
};

const processImage = (src, options = {}) => {
  return new Promise(async (resolve, reject) => {
    const defaultCallback = (percent, message) => {
      console.log(`Percent: ${percent}, message: ${message}`);
    };
    await nextFrame();
    const config = {
      showHangers: options.showHangers || false,
      statusCallback: options.statusCallback || defaultCallback,
      svgOptions: options.svgOptions || defaultSvgOptions,
      trimWhiteSpace: options.trimWhiteSpace || false,
    };
    if (src) {
      config.statusCallback(5, 'Loading Image');
      await nextFrame();
      var image = new Image();
      image.onload = async () => {
        await nextFrame();
        const srcCanvas = document.createElement('canvas');
        srcCanvas.height = image.height;
        srcCanvas.width = image.width;
        const srcCtx = srcCanvas.getContext('2d');
        srcCtx.drawImage(image, 0, 0);
        let canvas = await preprocessCanvas(srcCanvas, config);
        config.statusCallback(80, 'Parsing SVG');
        await nextFrame();

        // preshrink image to match output scale
        if (config.svgOptions.scale && config.svgOptions.scale === 2) {
          canvas = resizeCanvas(canvas, Math.round(canvas.width / 2), Math.round(canvas.height / 2));
        }

        // Getting ImageData from canvas with the helper function getImgdata().
        const imgd = ImageTracer.getImgdata(canvas);

        // Synchronous tracing to SVG string
        let svgstr = ImageTracer.imagedataToSVG(imgd, config.svgOptions);
        let svgson = await parse(svgstr);
        config.statusCallback(95, 'Looking for hangers');
        await nextFrame();

        // sort by most complex shape
        svgson.children.sort((b, a) =>
          a.attributes.d.length > b.attributes.d.length ? 1 : b.attributes.d.length > a.attributes.d.length ? -1 : 0,
        );
        let numSections = 0;

        // remove the white (background) shapes.
        svgson.children = svgson.children
          .map(v => {
            const rgb = v.attributes.fill;
            const [r, g, b] = rgb
              .substring(4, rgb.length - 1)
              .replace(/ /g, '')
              .split(',')
              .map(x => parseInt(x));
            const mean = (r + g + b) / 3;
            if (mean < 200) {
              if (numSections === 0) {
                v.attributes.fill = 'rgb(0,0,0)';
                numSections++;
                return v;
              } else {
                // dont return this one to not include floters.
                v.attributes.fill = 'rgb(240,10,10)';
                numSections++;
                if (config.showHangers) {
                  // return hangers only if we are showing them
                  return v;
                }
              }
            }
          })
          .filter(v => v);
        svgstr = stringify(svgson);
        const blob = new Blob([svgstr], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        config.statusCallback(100, 'Done');
        await nextFrame();
        resolve(url);
      };
      image.crossOrigin = 'anonymous';
      image.src = src;
    } else {
      resolve(null);
    }
  });
};

export default processImage;
