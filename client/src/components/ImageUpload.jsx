@@ .. @@
 import React, { useState, useEffect } from "react";
 import PropTypes from "prop-types";
+import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
+import { Sparkles, Upload, Grid3X3 } from 'lucide-react';
 
 // Auto-import all images from /public/images/*/*
 const imageModules = import.meta.glob(
@@ -7,6 +10,7 @@ const imageModules = import.meta.glob(
 
 export default function ImageUpload({ onSelectImage }) {
   const [templates, setTemplates] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
+  const [activeTab, setActiveTab] = useState('templates');
 
   useEffect(() => {
     // Build templates list from files
@@ .. @@
   const filteredTemplates = templates.filter((t) =>
     t.name.toLowerCase().includes(searchTerm.toLowerCase())
   );
 
+  const handleFileUpload = (event) => {
+    const file = event.target.files[0];
+    if (file) {
+      const reader = new FileReader();
+      reader.onload = (e) => {
+        onSelectImage(e.target.result);
+      };
+      reader.readAsDataURL(file);
+    }
+  };
+
   return (
-    <div className="p-4">
-      {/* Search box */}
-      <input
-        type="text"
-        placeholder="Search templates..."
-        className="border px-3 py-1 rounded w-full mb-4"
-        value={searchTerm}
-        onChange={(e) => setSearchTerm(e.target.value)}
-      />
-
-      {/* Templates grid */}
-      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
-        {filteredTemplates.map((template) => (
-          <div
-            key={template.id}
-            className="border rounded overflow-hidden cursor-pointer group"
-            onClick={() => onSelectImage(template)}
-          >
-            <img
-              src={template.url}
-              alt={template.name}
-              loading="lazy"
-              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
-              onError={(e) => (e.target.src = "/images/placeholder.jpg")}
-            />
+    <div>
+      {/* Tab Navigation */}
+      <div className="flex border-b border-gray-200 mb-4">
+        <button
+          onClick={() => setActiveTab('templates')}
+          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
+            activeTab === 'templates'
+              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
+              : 'text-gray-600 hover:text-gray-800'
+          }`}
+        >
+          <Grid3X3 className="h-4 w-4 inline mr-1" />
+          Templates
+        </button>
+        <button
+          onClick={() => setActiveTab('upload')}
+          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
+            activeTab === 'upload'
+              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
+              : 'text-gray-600 hover:text-gray-800'
+          }`}
+        >
+          <Upload className="h-4 w-4 inline mr-1" />
+          Upload
+        </button>
+      </div>
+
+      {activeTab === 'templates' && (
+        <div>
+          {/* Search box */}
+          <input
+            type="text"
+            placeholder="Search templates..."
+            className="border px-3 py-2 rounded w-full mb-4 text-sm"
+            value={searchTerm}
+            onChange={(e) => setSearchTerm(e.target.value)}
+          />
+
+          {/* Templates grid */}
+          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
+            {filteredTemplates.slice(0, 20).map((template) => (
+              <div
+                key={template.id}
+                className="border rounded-lg overflow-hidden cursor-pointer group hover:shadow-md transition-shadow"
+                onClick={() => onSelectImage(template.url)}
+              >
+                <img
+                  src={template.url}
+                  alt={template.name}
+                  loading="lazy"
+                  className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300"
+                  onError={(e) => (e.target.src = "/images/placeholder.jpg")}
+                />
+                <div className="p-2">
+                  <p className="text-xs text-gray-600 truncate">{template.name}</p>
+                </div>
+              </div>
+            ))}
           </div>
-        ))}
-      </div>
+
+          {filteredTemplates.length > 20 && (
+            <button
+              onClick={() => window.dispatchEvent(new CustomEvent('viewMoreTemplates'))}
+              className="w-full mt-3 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
+            >
+              View All Templates ({filteredTemplates.length})
+            </button>
+          )}
+        </div>
+      )}
+
+      {activeTab === 'upload' && (
+        <div className="space-y-4">
+          {/* File Upload */}
+          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
+            <input
+              type="file"
+              accept="image/*,video/*"
+              onChange={handleFileUpload}
+              className="hidden"
+              id="file-upload"
+            />
+            <label htmlFor="file-upload" className="cursor-pointer">
+              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
+              <p className="text-sm text-gray-600 font-medium">
+                Click to upload image or video
+              </p>
+              <p className="text-xs text-gray-500 mt-1">
+                PNG, JPG, GIF, MP4, WebM up to 10MB
+              </p>
+            </label>
+          </div>
+
+          {/* AI Image Generation */}
+          <SignedIn>
+            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
+              <div className="flex items-center gap-2 mb-2">
+                <Sparkles className="h-5 w-5 text-purple-600" />
+                <h4 className="text-sm font-semibold text-purple-800">AI Image Generation</h4>
+              </div>
+              <p className="text-xs text-purple-700 mb-3">
+                Generate custom meme images with AI (coming soon)
+              </p>
+              <button
+                disabled
+                className="w-full py-2 px-4 bg-purple-200 text-purple-600 rounded-lg text-sm font-medium cursor-not-allowed"
+              >
+                Coming Soon
+              </button>
+            </div>
+          </SignedIn>
+
+          <SignedOut>
+            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
+              <div className="flex items-center gap-2 mb-2">
+                <Sparkles className="h-5 w-5 text-gray-400" />
+                <h4 className="text-sm font-semibold text-gray-600">AI Features</h4>
+              </div>
+              <p className="text-xs text-gray-600 mb-3">
+                Sign in to access AI image generation and more premium features
+              </p>
+              <SignInButton mode="modal">
+                <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
+                  Sign In to Unlock
+                </button>
+              </SignInButton>
+            </div>
+          </SignedOut>
+        </div>
+      )}
     </div>
   );
 }
 
 ImageUpload.propTypes = {
-  onSelectImage: PropTypes.func.isRequired,
+  onSelectImage: PropTypes.func.isRequired
 };