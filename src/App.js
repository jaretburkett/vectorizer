import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import ImageTracer from 'imagetracerjs';
import colors from './colors';

const colorPalette = colors.map(c => c.rgba);

const svgOptions = {
  scale: 1,
  pal: colorPalette,
  blurradius: 5,
};

function App() {
  const [src, setSrc] = useState('/american_gothic_mug-thumb.png');
  const [outUrl, setOutUrl] = useState(null);
  useEffect(() => {
    ImageTracer.loadImage(src, canvas => {
      // Getting ImageData from canvas with the helper function getImgdata().
      const imgd = ImageTracer.getImgdata(canvas);

      // Synchronous tracing to SVG string
      const svgstr = ImageTracer.imagedataToSVG(imgd, svgOptions);
      console.log(svgstr);
      const blob = new Blob([svgstr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      setOutUrl(url);
      // // Appending SVG
      // ImageTracer.appendSVGString(svgstr, 'svgcontainer');
    });
  }, [src]);

  return (
    <div className="App">
      <header className="App-header">{outUrl ? <img src={outUrl} /> : null}</header>

      <div>
        {colors.map(c => {
          return <div style={{ color: `#${c.hex}` }}>{c.name}</div>;
        })}
      </div>
    </div>
  );
}

export default App;
