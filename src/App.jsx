import React, { useEffect, useRef, useState } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import Hammer from 'hammerjs';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Sidebar from './components/Sidebar';

export default function App() {
  const elementRef = useRef(null);
  const [currentTool, setCurrentTool] = useState('Length');
  const annotationBackupRef = useRef({});
  const [annotationsVisible, setAnnotationsVisible] = useState(true);
  useEffect(() => {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;


    if (elementRef.current) {
      cornerstone.enable(elementRef.current);
    }

    cornerstoneTools.init();
    
    cornerstoneTools.addTool(cornerstoneTools.LengthTool);
    cornerstoneTools.addTool(cornerstoneTools.PanTool);
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
    cornerstoneTools.addTool(cornerstoneTools.FreehandRoiTool);


    cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });

    return () => {
      if (elementRef.current) {
        cornerstone.disable(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!elementRef.current) return;
    cornerstoneTools.setToolActive(currentTool, { mouseButtonMask: 1 });
  }, [currentTool]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !elementRef.current) return;

    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    try {
      const image = await cornerstone.loadAndCacheImage(imageId);
      cornerstone.displayImage(elementRef.current, image);
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };
  const handleAction = (action) => {
    const element = elementRef.current;
    const viewport = cornerstone.getViewport(element);
    switch(action) {
      case 'length':
        cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });
        break;
      case 'roi':
        cornerstoneTools.setToolActive('FreehandRoi', { mouseButtonMask: 1 });
        break;
      case 'zoom':
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 });
        break;
      case 'flipH':
        viewport.hflip = !viewport.hflip;
        cornerstone.setViewport(element, viewport);
        cornerstoneTools.setToolActive('FlipH', { mouseButtonMask: 1 });
        break;
      case 'flipV':
        viewport.vflip = !viewport.vflip;
        cornerstone.setViewport(element, viewport);
        cornerstoneTools.setToolActive('FlipV', { mouseButtonMask: 1 });
        break;
      case 'rotate90':
        viewport.rotation = (viewport.rotation + 90) % 360;
        cornerstone.setViewport(element, viewport);
        cornerstoneTools.setToolActive('Rotate90', { mouseButtonMask: 1 });
        break;
      case 'invert':
        viewport.invert = !viewport.invert;
        cornerstone.setViewport(element, viewport);
        cornerstoneTools.setToolActive('Invert', { mouseButtonMask: 1 });
        break;
      case 'save':
        { const ee = cornerstone.getEnabledElement(element);
        const canvas = ee.canvas;
        const png = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'dicom_image.png';
        link.href = png;
        link.click();
        cornerstoneTools.setToolActive('Save', { mouseButtonMask: 1 });
        break; } 
        case 'toggleAnnotations': {
          const toolNames = ['FreehandRoi', 'Length'];
    
          if (annotationsVisible) {
            annotationBackupRef.current = {};
            toolNames.forEach((toolName) => {
              const toolState = cornerstoneTools.getToolState(element, toolName);
              annotationBackupRef.current[toolName] = JSON.parse(JSON.stringify(toolState));
              cornerstoneTools.clearToolState(element, toolName);
            });
            cornerstone.updateImage(element); 
          } else {
            Object.entries(annotationBackupRef.current).forEach(([toolName, stateData]) => {
              cornerstoneTools.addToolState(element, toolName, stateData);
            });
            cornerstone.updateImage(element);
          }
    
          setAnnotationsVisible(!annotationsVisible);
          break;
        }
      default:
        break;
    }
  };
  
  return (
    <div className="flex h-full bg-white">
      <Sidebar 
        onFileSelect={handleFileChange} 
        currentTool={currentTool} 
        setCurrentTool={setCurrentTool}
        onSelectTool={setCurrentTool} 
        onAction={handleAction}
      />
      <div
        ref={elementRef}
        className="flex-1 bg-black"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}




