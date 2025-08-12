import React, { useState, useRef, useEffect } from 'react';
import { Move, RotateCcw, Palette, Type } from 'lucide-react';

const DragDropText = ({ canvas, texts, onTextsChange }) => {
  const [selectedTextIndex, setSelectedTextIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvas) {
      canvasRef.current = canvas;
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseleave', handleMouseUp);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
      };
    }
  }, [canvas, texts, selectedTextIndex, isDragging]);

  const getTextBounds = (text, index) => {
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    const fontSize = Math.max(text.fontSize * (canvas.width / 500), 12);
    ctx.font = `bold ${fontSize}px Impact, "Arial Black", Arial, sans-serif`;
    
    const metrics = ctx.measureText(text.content);
    const x = canvas.width / 2;
    const y = (text.y / 100) * canvas.height;
    
    return {
      x: x - metrics.width / 2,
      y: y - fontSize / 2,
      width: metrics.width,
      height: fontSize
    };
  };

  const getClickedTextIndex = (mouseX, mouseY) => {
    for (let i = texts.length - 1; i >= 0; i--) {
      const bounds = getTextBounds(texts[i], i);
      if (bounds && 
          mouseX >= bounds.x && 
          mouseX <= bounds.x + bounds.width &&
          mouseY >= bounds.y && 
          mouseY <= bounds.y + bounds.height) {
        return i;
      }
    }
    return null;
  };

  const handleMouseDown = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const clickedIndex = getClickedTextIndex(mouseX, mouseY);
    
    if (clickedIndex !== null) {
      setSelectedTextIndex(clickedIndex);
      setIsDragging(true);
      
      const text = texts[clickedIndex];
      const textX = canvas.width / 2;
      const textY = (text.y / 100) * canvas.height;
      
      setDragOffset({
        x: mouseX - textX,
        y: mouseY - textY
      });
      
      canvas.style.cursor = 'grabbing';
    } else {
      setSelectedTextIndex(null);
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (isDragging && selectedTextIndex !== null) {
      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;
      
      // Convert back to percentage
      const newYPercent = Math.max(5, Math.min(95, (newY / canvas.height) * 100));
      
      const updatedTexts = [...texts];
      updatedTexts[selectedTextIndex] = {
        ...updatedTexts[selectedTextIndex],
        y: newYPercent
      };
      
      onTextsChange(updatedTexts);
    } else {
      // Check if hovering over text
      const hoveredIndex = getClickedTextIndex(mouseX, mouseY);
      canvas.style.cursor = hoveredIndex !== null ? 'grab' : 'default';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    canvas.style.cursor = 'default';
  };

  const addNewText = () => {
    const newText = {
      content: 'NEW TEXT',
      fontSize: 48,
      color: '#FFFFFF',
      stroke: '#000000',
      strokeWidth: 3,
      y: 50
    };
    
    onTextsChange([...texts, newText]);
    setSelectedTextIndex(texts.length);
  };

  const removeText = (index) => {
    const updatedTexts = texts.filter((_, i) => i !== index);
    onTextsChange(updatedTexts);
    setSelectedTextIndex(null);
  };

  const updateSelectedText = (updates) => {
    if (selectedTextIndex === null) return;
    
    const updatedTexts = [...texts];
    updatedTexts[selectedTextIndex] = {
      ...updatedTexts[selectedTextIndex],
      ...updates
    };
    
    onTextsChange(updatedTexts);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Move className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Drag & Drop Text</h3>
      </div>

      {/* Add Text Button */}
      <button
        onClick={addNewText}
        className="w-full mb-4 py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
      >
        + Add New Text
      </button>

      {/* Text List */}
      <div className="space-y-3 mb-4">
        {texts.map((text, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
              selectedTextIndex === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedTextIndex(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {text.content || 'Empty Text'}
                </p>
                <p className="text-xs text-gray-500">
                  Position: {text.y.toFixed(0)}% from top
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeText(index);
                }}
                className="ml-2 px-2 py-1 text-xs text-red-600 hover:bg-red-100 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Text Controls */}
      {selectedTextIndex !== null && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Edit Selected Text
          </h4>
          
          <div className="space-y-3">
            {/* Text Content */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Text Content
              </label>
              <input
                type="text"
                value={texts[selectedTextIndex].content}
                onChange={(e) => updateSelectedText({ content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Font Size: {texts[selectedTextIndex].fontSize}px
              </label>
              <input
                type="range"
                min="16"
                max="120"
                value={texts[selectedTextIndex].fontSize}
                onChange={(e) => updateSelectedText({ fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Text Color
                </label>
                <input
                  type="color"
                  value={texts[selectedTextIndex].color}
                  onChange={(e) => updateSelectedText({ color: e.target.value })}
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Outline Color
                </label>
                <input
                  type="color"
                  value={texts[selectedTextIndex].stroke}
                  onChange={(e) => updateSelectedText({ stroke: e.target.value })}
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Outline Width */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Outline Width: {texts[selectedTextIndex].strokeWidth}px
              </label>
              <input
                type="range"
                min="0"
                max="8"
                value={texts[selectedTextIndex].strokeWidth}
                onChange={(e) => updateSelectedText({ strokeWidth: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Click and drag text directly on the meme preview to reposition it. 
          Click on text items here to select and edit them.
        </p>
      </div>
    </div>
  );
};

export default DragDropText;