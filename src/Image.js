import logo from './logo.svg';
import './App.css';
import 'rc-slider/assets/index.css';
import { useState, useEffect } from 'react';
import processImage from './lib/processImage';
import Slider, { Range } from 'rc-slider';

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

const objCopy = obj => {
  return JSON.parse(JSON.stringify(obj));
};

const SliderWithTooltip = Slider.createSliderWithTooltip(Slider);

function Image() {
  const hashFile = window.location.hash.substring(1);

  const srcUrl = hashFile.length > 1 ? `/${hashFile}` : null;
  const [src, setSrc] = useState(srcUrl);
  const [outUrl, setOutUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHangers, setShowHangers] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading');
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [svgOptions, setSvgOptions] = useState(defaultSvgOptions);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  useEffect(() => {
    setOutUrl(null);
    if (src) {
      setLoadingMessage('Loading');
      setLoadingPercent(0);
      setIsProcessing(true);
      processImage(src, {
        showHangers: showHangers,
        statusCallback: (percent, message) => {
          setLoadingPercent(percent);
          setLoadingMessage(message);
        },
        svgOptions: svgOptions,
        trimWhiteSpace: true,
      }).then(url => {
        setOutUrl(url);
        setIsProcessing(false);
      });
    }
  }, [src, updateTrigger, showHangers]);

  const update = () => {
    setUpdateTrigger(updateTrigger + 1);
  };

  return (
    <div className="App" style={{ width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
      <header className="App-header">
        {src ? (
          outUrl ? (
            <div style={{ background: '#fff', maxWidth: '80%', lineHeight: 0 }}>
              <img style={{ maxWidth: '100%' }} src={outUrl} />
            </div>
          ) : null
        ) : (
          <h3>Select image with thing below to test it.</h3>
        )}
      </header>
      {/* Slider */}
      <div className="sliders">
        <div>
          blurradius <div className="slider-val">{svgOptions.blurradius}</div>
          <small>Set this to 1..5 for selective Gaussian blur preprocessing.</small>
        </div>
        <SliderWithTooltip
          min={0}
          max={5}
          value={svgOptions.blurradius}
          onChange={val => {
            console.log(val);
            const newObj = objCopy(svgOptions);
            newObj.blurradius = val;
            setSvgOptions(newObj);
          }}
          onAfterChange={val => {
            update();
          }}
        />

        <div>
          ltres <div className="slider-val">{svgOptions.ltres}</div>
          <small>Error treshold for straight lines.</small>
        </div>
        <SliderWithTooltip
          min={0}
          max={50}
          value={svgOptions.ltres}
          onChange={val => {
            console.log(val);
            const newObj = objCopy(svgOptions);
            newObj.ltres = val;
            setSvgOptions(newObj);
          }}
          onAfterChange={val => {
            update();
          }}
        />

        <div>
          qtres <div className="slider-val">{svgOptions.qtres}</div>
          <small>Error treshold for quadratic splines.</small>
        </div>
        <SliderWithTooltip
          min={0}
          max={50}
          value={svgOptions.qtres}
          onChange={val => {
            console.log(val);
            const newObj = objCopy(svgOptions);
            newObj.qtres = val;
            setSvgOptions(newObj);
          }}
          onAfterChange={val => {
            update();
          }}
        />

        <div>
          pathomit <div className="slider-val">{svgOptions.pathomit}</div>
          <small>Edge node paths shorter than this will be discarded for noise reduction.</small>
        </div>
        <SliderWithTooltip
          min={0}
          max={50}
          value={svgOptions.pathomit}
          onChange={val => {
            console.log(val);
            const newObj = objCopy(svgOptions);
            newObj.pathomit = val;
            setSvgOptions(newObj);
          }}
          onAfterChange={val => {
            update();
          }}
        />
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 300,
          maxWidth: '90%',
          zIndex: 100,
          minHeight: 30,
          background: '#fff',
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
          padding: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
      >
        {/* <div className="loader" style={{display: isProcessing ? 'block': 'none'}}>Loading...</div> */}
        <div
          style={{
            height: 10,
            background: 'rgba(0,0,0,0.1)',
            overflow: 'none',
            position: 'relative',
            display: isProcessing ? 'block' : 'none',
          }}
        >
          <div
            style={{
              width: `${loadingPercent}%`,
              background: 'rgba(10, 200, 10, 0.5)',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
            }}
          ></div>
        </div>
        <div
          style={{
            padding: 10,
            display: isProcessing ? 'block' : 'none',
          }}
        >
          {loadingMessage}
        </div>
        <input
          id="fileItem"
          type="file"
          style={{
            display: isProcessing ? 'none' : 'block',
          }}
          onChange={event => {
            if (event.target.files && event.target.files.length > 0) {
              setSrc(URL.createObjectURL(event.target.files[0]));
            }
          }}
        ></input>
        <div
          style={{
            padding: '5px 10px',
            background: '#333',
            color: '#fff',
            cursor: 'pointer',
            margin: '10px 0 0',
            borderRadius: 5,
            display: isProcessing ? 'none' : 'inline-block',
          }}
          onClick={() => setShowHangers(!showHangers)}
        >
          {showHangers ? 'Hide Hangers' : 'Show Hangers'}
        </div>
      </div>
    </div>
  );
}

export default Image;
