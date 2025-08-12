import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RotateCcw, Palette, Type, Image as ImageIcon, Video, Play, Pause, Download } from 'lucide-react';
import ImageUpload from './ImageUpload';
import TextControls from './TextControls';
import { drawMemeOnCanvas, drawMemeOnVideo } from '../utils/canvas.js';

const MemeGenerator = ({ preselectedTemplate }) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [mediaType, setMediaType] = useState('image'); // 'image', 'video', 'gif'
  const [isPlaying, setIsPlaying] = useState(false);
  const [topText, setTopText] = useState({
    content: 'TOP TEXT',
    fontSize: 48,
    color: '#FFFFFF',
    stroke: '#000000',
    strokeWidth: 3,
    y: 50
  });
  const [bottomText, setBottomText] = useState({
    content: 'BOTTOM TEXT',
    fontSize: 48,
    color: '#FFFFFF',
    stroke: '#000000',
    strokeWidth: 3,
    y: 90
  });

  const previewRef = useRef(null);
  const videoRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Handle preselected template
  useEffect(() => {
    if (preselectedTemplate) {
      handleImageSelect(preselectedTemplate);
      // Clear the preselected template after using it
      setTimeout(() => {
        // This ensures the template loads properly
      }, 100);
    }
  }, [preselectedTemplate]);

  const handleAIMemeGenerated = (imageUrl, topTextContent, bottomTextContent) => {
    setTopText(prev => ({ ...prev, content: topTextContent }));
    setBottomText(prev => ({ ...prev, content: bottomTextContent }));
  };

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    if (imageUrl.includes('data:video/') || imageUrl.match(/\.(mp4|webm|ogg|mov)$/i)) {
      setMediaType('video');
    } else if (imageUrl.includes('data:image/gif') || imageUrl.match(/\.gif$/i)) {
      setMediaType('gif');
    } else {
      setMediaType('image');
    }
  };

  const updatePreview = useCallback(() => {
    if (!selectedImage) return;
    if (mediaType === 'video') {
      updateVideoPreview();
    } else {
      updateImagePreview();
    }
  }, [selectedImage, topText, bottomText, mediaType]);

  const updateImagePreview = () => {
    if (!previewRef.current) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      drawMemeOnCanvas(previewRef.current, img, topText, bottomText);
    };
    img.src = selectedImage;
  };

  const updateVideoPreview = () => {
    if (!videoRef.current || !previewRef.current) return;
    const video = videoRef.current;
    const canvas = previewRef.current;
    const ctx = canvas.getContext('2d');
    const drawFrame = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = Math.min(video.videoWidth, 600);
        canvas.height = Math.min(video.videoHeight, 600);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        drawMemeOnVideo(canvas, topText, bottomText);
      }
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(drawFrame);
      }
    };
    if (isPlaying) {
      drawFrame();
    } else {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = Math.min(video.videoWidth, 600);
        canvas.height = Math.min(video.videoHeight, 600);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        drawMemeOnVideo(canvas, topText, bottomText);
      }
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      cancelAnimationFrame(animationFrameRef.current);
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const resetMeme = () => {
    setTopText(prev => ({ ...prev, content: 'TOP TEXT' }));
    setBottomText(prev => ({ ...prev, content: 'BOTTOM TEXT' }));
    setIsPlaying(false);
    cancelAnimationFrame(animationFrameRef.current);
  };

  const downloadMeme = () => {
    if (!previewRef.current) return;
    const link = document.createElement('a');
    link.download = `meme-${Date.now()}.png`;
    link.href = previewRef.current.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-6">
      {/* Image Upload */}
      <div className="w-full lg:w-1/4">
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            {mediaType === 'video' ? (
              <Video className="h-6 w-6 text-blue-600" />
            ) : (
              <ImageIcon className="h-6 w-6 text-blue-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">Choose Media</h3>
          </div>
          <ImageUpload
            onImageSelect={handleImageSelect}
            onAIMemeGenerated={handleAIMemeGenerated}
            onViewMoreTemplates={() => {
              // This will be handled by the parent App component
              window.dispatchEvent(new CustomEvent('viewMoreTemplates'));
            }}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 min-w-[450px] flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
          {mediaType === 'video' && selectedImage && (
            <button
              onClick={togglePlayPause}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play
                </>
              )}
            </button>
          )}
        </div>
        
        {selectedImage ? (
          <>
            <div className="relative">
              {mediaType === 'video' && (
                <video
                  ref={videoRef}
                  src={selectedImage}
                  className="hidden"
                  onLoadedMetadata={updatePreview}
                  onTimeUpdate={updateVideoPreview}
                  loop
                  muted
                />
              )}
              <canvas
                ref={previewRef}
                className="w-full max-w-[600px] max-h-[550px] rounded-xl shadow-md border border-gray-300"
                width={600}
                height={600}
              />
              {mediaType === 'video' && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {isPlaying ? 'Playing' : 'Paused'} • Click Play to preview
                </div>
              )}
            </div>
            {/* Download button under preview */}
            <button
              onClick={downloadMeme}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Meme
            </button>
          </>
        ) : (
          <div className="w-full max-w-lg h-96 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-base text-gray-600 font-medium">
                Select media to start
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Images, videos, GIFs supported
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Text Settings & Actions */}
      <div className="w-full lg:w-1/4 space-y-5">
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Type className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Text Settings</h3>
          </div>
          <div className="space-y-5">
            <TextControls
              text={topText}
              onChange={setTopText}
              placeholder="Enter top text..."
            />
            <TextControls
              text={bottomText}
              onChange={setBottomText}
              placeholder="Enter bottom text..."
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={resetMeme}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 rounded-lg text-sm font-medium"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;
