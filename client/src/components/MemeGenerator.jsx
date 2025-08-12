@@ .. @@
 import React, { useState, useRef, useCallback, useEffect } from 'react';
-import { RotateCcw, Palette, Type, Image as ImageIcon, Video, Play, Pause, Download } from 'lucide-react';
+import { RotateCcw, Palette, Type, Image as ImageIcon, Video, Play, Pause, Download, Sparkles } from 'lucide-react';
+import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
 import ImageUpload from './ImageUpload';
 import TextControls from './TextControls';
+import AICaptionGenerator from './AICaptionGenerator';
+import DragDropText from './DragDropText';
 import { drawMemeOnCanvas, drawMemeOnVideo } from '../utils/canvas.js';
 
 const MemeGenerator = ({ preselectedTemplate }) => {
   const [selectedImage, setSelectedImage] = useState('');
   const [mediaType, setMediaType] = useState('image'); // 'image', 'video', 'gif'
   const [isPlaying, setIsPlaying] = useState(false);
-  const [topText, setTopText] = useState({
+  const [texts, setTexts] = useState([
+    {
+      content: 'TOP TEXT',
+      fontSize: 48,
+      color: '#FFFFFF',
+      stroke: '#000000',
+      strokeWidth: 3,
+      y: 20
+    },
+    {
+      content: 'BOTTOM TEXT',
+      fontSize: 48,
+      color: '#FFFFFF',
+      stroke: '#000000',
+      strokeWidth: 3,
+      y: 80
+    }
+  ]);
+  
+  // Keep backward compatibility
+  const [topText, setTopText] = useState({
     content: 'TOP TEXT',
     fontSize: 48,
     color: '#FFFFFF',
@@ -1,6 +1,37 @@
     strokeWidth: 3,
     y: 90
   });
+  
+  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'ai-caption', 'drag-drop'
 
   const previewRef = useRef(null);
   const videoRef = useRef(null);
@@ .. @@
     }
   }, [preselectedTemplate]);
 
-  const handleAIMemeGenerated = (imageUrl, topTextContent, bottomTextContent) => {
-    setTopText(prev => ({ ...prev, content: topTextContent }));
-    setBottomText(prev => ({ ...prev, content: bottomTextContent }));
+  const handleCaptionSelect = (caption) => {
+    // Split caption into parts if it contains common separators
+    const parts = caption.split(/\s*[\|\-\n]\s*/);
+    
+    if (parts.length >= 2) {
+      // Update both top and bottom text
+      const newTexts = [...texts];
+      newTexts[0] = { ...newTexts[0], content: parts[0].trim() };
+      newTexts[1] = { ...newTexts[1], content: parts[1].trim() };
+      setTexts(newTexts);
+      
+      // Also update legacy state
+      setTopText(prev => ({ ...prev, content: parts[0].trim() }));
+      setBottomText(prev => ({ ...prev, content: parts[1].trim() }));
+    } else {
+      // Use as single text
+      const newTexts = [...texts];
+      newTexts[0] = { ...newTexts[0], content: caption };
+      setTexts(newTexts);
+      
+      setTopText(prev => ({ ...prev, content: caption }));
+    }
   };
 
   const handleImageSelect = (imageUrl) => {
@@ .. @@
   const updatePreview = useCallback(() => {
     if (!selectedImage) return;
     if (mediaType === 'video') {
       updateVideoPreview();
     } else {
       updateImagePreview();
     }
-  }, [selectedImage, topText, bottomText, mediaType]);
+  }, [selectedImage, texts, topText, bottomText, mediaType]);
 
   const updateImagePreview = () => {
     if (!previewRef.current) return;
     const img = new Image();
     img.crossOrigin = 'anonymous';
     img.onload = () => {
-      drawMemeOnCanvas(previewRef.current, img, topText, bottomText);
+      // Use texts array for drawing, fallback to legacy topText/bottomText
+      const textsToDraw = texts.length > 0 ? texts : [topText, bottomText];
+      drawMemeOnCanvasMultiple(previewRef.current, img, textsToDraw);
     };
     img.src = selectedImage;
   };
 
+  const drawMemeOnCanvasMultiple = (canvas, image, textsArray) => {
+    const ctx = canvas.getContext('2d');
+    if (!ctx) return;
+
+    // Set canvas dimensions
+    const maxWidth = 500;
+    const maxHeight = 500;
+    let { width, height } = image;
+
+    if (width > maxWidth || height > maxHeight) {
+      const scale = Math.min(maxWidth / width, maxHeight / height);
+      width *= scale;
+      height *= scale;
+    }
+
+    canvas.width = width;
+    canvas.height = height;
+
+    // Clear and draw image
+    ctx.clearRect(0, 0, width, height);
+    ctx.drawImage(image, 0, 0, width, height);
+
+    // Draw all texts
+    textsArray.forEach(text => {
+      if (!text.content.trim()) return;
+
+      const fontSize = Math.max(text.fontSize * (width / 500), 12);
+      ctx.font = `bold ${fontSize}px Impact, "Arial Black", Arial, sans-serif`;
+      ctx.textAlign = 'center';
+      ctx.textBaseline = 'middle';
+
+      const x = width / 2;
+      const y = (text.y / 100) * height;
+
+      // Draw stroke
+      if (text.strokeWidth > 0) {
+        ctx.strokeStyle = text.stroke;
+        ctx.lineWidth = Math.max(text.strokeWidth * (width / 500), 1);
+        ctx.lineJoin = 'round';
+        ctx.lineCap = 'round';
+        ctx.strokeText(text.content, x, y);
+      }
+
+      // Fill text
+      ctx.fillStyle = text.color;
+      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
+      ctx.shadowBlur = 2;
+      ctx.shadowOffsetX = 1;
+      ctx.shadowOffsetY = 1;
+      ctx.fillText(text.content, x, y);
+
+      // Reset shadow
+      ctx.shadowColor = 'transparent';
+      ctx.shadowBlur = 0;
+      ctx.shadowOffsetX = 0;
+      ctx.shadowOffsetY = 0;
+    });
+  };
+
   const updateVideoPreview = () => {
     if (!videoRef.current || !previewRef.current) return;
     const video = videoRef.current;
@@ .. @@
       if (video.videoWidth && video.videoHeight) {
         canvas.width = Math.min(video.videoWidth, 600);
         canvas.height = Math.min(video.videoHeight, 600);
         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
-        drawMemeOnVideo(canvas, topText, bottomText);
+        drawMemeOnVideoMultiple(canvas, texts.length > 0 ? texts : [topText, bottomText]);
       }
       if (isPlaying) {
         animationFrameRef.current = requestAnimationFrame(drawFrame);
@@ .. @@
       if (video.videoWidth && video.videoHeight) {
         canvas.width = Math.min(video.videoWidth, 600);
         canvas.height = Math.min(video.videoHeight, 600);
         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
-        drawMemeOnVideo(canvas, topText, bottomText);
+        drawMemeOnVideoMultiple(canvas, texts.length > 0 ? texts : [topText, bottomText]);
       }
     }
   };
 
+  const drawMemeOnVideoMultiple = (canvas, textsArray) => {
+    const ctx = canvas.getContext('2d');
+    if (!ctx) return;
+
+    const { width, height } = canvas;
+
+    textsArray.forEach(text => {
+      if (!text.content.trim()) return;
+
+      const fontSize = Math.max(text.fontSize * (width / 500), 16);
+      ctx.font = `bold ${fontSize}px Impact, "Arial Black", Arial, sans-serif`;
+      ctx.textAlign = 'center';
+      ctx.textBaseline = 'middle';
+
+      const x = width / 2;
+      const y = (text.y / 100) * height;
+
+      // Draw stroke
+      if (text.strokeWidth > 0) {
+        ctx.strokeStyle = text.stroke;
+        ctx.lineWidth = Math.max(text.strokeWidth * (width / 500), 2);
+        ctx.lineJoin = 'round';
+        ctx.lineCap = 'round';
+        ctx.strokeText(text.content, x, y);
+      }
+
+      // Fill text
+      ctx.fillStyle = text.color;
+      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
+      ctx.shadowBlur = 4;
+      ctx.shadowOffsetX = 2;
+      ctx.shadowOffsetY = 2;
+      ctx.fillText(text.content, x, y);
+
+      // Reset shadow
+      ctx.shadowColor = 'transparent';
+      ctx.shadowBlur = 0;
+      ctx.shadowOffsetX = 0;
+      ctx.shadowOffsetY = 0;
+    });
+  };
+
   const togglePlayPause = () => {
     if (!videoRef.current) return;
     if (isPlaying) {
@@ .. @@
   const resetMeme = () => {
-    setTopText(prev => ({ ...prev, content: 'TOP TEXT' }));
-    setBottomText(prev => ({ ...prev, content: 'BOTTOM TEXT' }));
+    setTexts([
+      {
+        content: 'TOP TEXT',
+        fontSize: 48,
+        color: '#FFFFFF',
+        stroke: '#000000',
+        strokeWidth: 3,
+        y: 20
+      },
+      {
+        content: 'BOTTOM TEXT',
+        fontSize: 48,
+        color: '#FFFFFF',
+        stroke: '#000000',
+        strokeWidth: 3,
+        y: 80
+      }
+    ]);
+    setTopText({ content: 'TOP TEXT', fontSize: 48, color: '#FFFFFF', stroke: '#000000', strokeWidth: 3, y: 50 });
+    setBottomText({ content: 'BOTTOM TEXT', fontSize: 48, color: '#FFFFFF', stroke: '#000000', strokeWidth: 3, y: 90 });
     setIsPlaying(false);
     cancelAnimationFrame(animationFrameRef.current);
   };
@@ .. @@
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
-            onAIMemeGenerated={handleAIMemeGenerated}
             onViewMoreTemplates={() => {
               // This will be handled by the parent App component
               window.dispatchEvent(new CustomEvent('viewMoreTemplates'));
             }}
           />
         </div>
       </div>
 
       {/* Preview */}
       <div className="flex-1 min-w-[450px] flex flex-col items-center">
@@ .. @@
       </div>
 
       {/* Text Settings & Actions */}
       <div className="w-full lg:w-1/4 space-y-5">
+        {/* Tab Navigation */}
+        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
+          <div className="flex border-b border-gray-200">
+            <button
+              onClick={() => setActiveTab('basic')}
+              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
+                activeTab === 'basic'
+                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
+                  : 'text-gray-600 hover:text-gray-800'
+              }`}
+            >
+              Basic
+            </button>
+            <SignedIn>
+              <button
+                onClick={() => setActiveTab('ai-caption')}
+                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
+                  activeTab === 'ai-caption'
+                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
+                    : 'text-gray-600 hover:text-gray-800'
+                }`}
+              >
+                <Sparkles className="h-4 w-4 inline mr-1" />
+                AI Caption
+              </button>
+              <button
+                onClick={() => setActiveTab('drag-drop')}
+                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
+                  activeTab === 'drag-drop'
+                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
+                    : 'text-gray-600 hover:text-gray-800'
+                }`}
+              >
+                Drag & Drop
+              </button>
+            </SignedIn>
+          </div>
+
+          <div className="p-5">
+            {activeTab === 'basic' && (
+              <div>
+                <div className="flex items-center gap-2 mb-4">
+                  <Type className="h-6 w-6 text-purple-600" />
+                  <h3 className="text-lg font-semibold text-gray-900">Text Settings</h3>
+                </div>
+                <div className="space-y-5">
+                  <TextControls
+                    text={topText}
+                    onChange={(newText) => {
+                      setTopText(newText);
+                      // Also update texts array
+                      const newTexts = [...texts];
+                      newTexts[0] = newText;
+                      setTexts(newTexts);
+                    }}
+                    placeholder="Enter top text..."
+                  />
+                  <TextControls
+                    text={bottomText}
+                    onChange={(newText) => {
+                      setBottomText(newText);
+                      // Also update texts array
+                      const newTexts = [...texts];
+                      newTexts[1] = newText;
+                      setTexts(newTexts);
+                    }}
+                    placeholder="Enter bottom text..."
+                  />
+                </div>
+              </div>
+            )}
+
+            <SignedIn>
+              {activeTab === 'ai-caption' && (
+                <AICaptionGenerator onCaptionSelect={handleCaptionSelect} />
+              )}
+
+              {activeTab === 'drag-drop' && (
+                <DragDropText 
+                  canvas={previewRef.current}
+                  texts={texts}
+                  onTextsChange={setTexts}
+                />
+              )}
+            </SignedIn>
+
+            <SignedOut>
+              {(activeTab === 'ai-caption' || activeTab === 'drag-drop') && (
+                <div className="text-center py-8">
+                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
+                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
+                    Premium Features
+                  </h3>
+                  <p className="text-gray-600 mb-4">
+                    Sign in to access AI caption generation and advanced drag & drop features.
+                  </p>
+                  <SignInButton mode="modal">
+                    <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
+                      Sign In to Unlock
+                    </button>
+                  </SignInButton>
+                </div>
+              )}
+            </SignedOut>
+          </div>
+        </div>
+
         <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
-          <div className="flex items-center gap-2 mb-4">
-            <Type className="h-6 w-6 text-purple-600" />
-            <h3 className="text-lg font-semibold text-gray-900">Text Settings</h3>
-          </div>
-          <div className="space-y-5">
-            <TextControls
-              text={topText}
-              onChange={setTopText}
-              placeholder="Enter top text..."
-            />
-            <TextControls
-              text={bottomText}
-              onChange={setBottomText}
-              placeholder="Enter bottom text..."
-            />
-          </div>
-        </div>
-
-        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
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