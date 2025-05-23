import React from 'react';
import ToolButton from './ToolButton';

export default function Sidebar({ onFileSelect, currentTool, setCurrentTool, onAction }) {
  return (
    <aside className="w-60 p-4 bg-gray-50 border-r">
      <h1>File Upload </h1>
      <div className="mb-4">
        <input
          type="file"
          accept=".dcm"
          onChange={onFileSelect}
          className="w-full text-sm text-gray-700"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <h1>Tools </h1>
        <ToolButton
        label="Length"
        active={currentTool === 'Length'}
        onClick={() => { setCurrentTool('Length'); onAction('length'); }}
      />
      <ToolButton
        label="Zoom"
        active={currentTool === 'Zoom'}
        onClick={() => { setCurrentTool('Zoom'); onAction('zoom'); }}
      />
      <ToolButton
        label="Freehand ROI"
        active={currentTool === 'FreehandRoi'}
        onClick={() => { setCurrentTool('FreehandRoi'); onAction('roi'); }}
      />
      <h1>Actions </h1>
      <ToolButton
        label="Flip H"
        onClick={() => onAction('flipH')}
      />
      <ToolButton
        label="Flip V"
        onClick={() => onAction('flipV')}
      />
      <ToolButton
        label="Rotate 90"
        onClick={() => onAction('rotate90')}
      />
      <ToolButton
        label="Invert"
        onClick={() => onAction('invert')}
      />
      <ToolButton
        label="Save"
        onClick={() => onAction('save')}
      />
      <ToolButton
        label="Toggle Annotations"
        onClick={() => onAction('toggleAnnotations')}
      />
      </div>
    </aside>
  );
}
