import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, RefreshCw } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

const AICaptionGenerator = ({ onCaptionSelect }) => {
  const { getToken } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('funny');
  const [captions, setCaptions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const vibes = [
    { id: 'funny', label: 'Funny', emoji: '😂' },
    { id: 'sarcastic', label: 'Sarcastic', emoji: '😏' },
    { id: 'relatable', label: 'Relatable', emoji: '😅' },
    { id: 'motivational', label: 'Motivational', emoji: '💪' },
    { id: 'parody', label: 'Parody', emoji: '🎭' },
    { id: 'savage', label: 'Savage', emoji: '🔥' },
    { id: 'wholesome', label: 'Wholesome', emoji: '🥰' },
    { id: 'cringe', label: 'Cringe', emoji: '😬' }
  ];

  const generateCaptions = async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic or category');
      return;
    }

    setIsGenerating(true);
    setError('');
    setCaptions([]);

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:3001/generate-captions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          vibe: selectedVibe
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate captions');
      }

      setCaptions(data.captions || []);
    } catch (err) {
      console.error('Caption generation error:', err);
      setError(err.message || 'Failed to generate captions');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (caption) => {
    navigator.clipboard.writeText(caption);
  };

  const handleCaptionClick = (caption) => {
    onCaptionSelect(caption);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-6 w-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Caption Generator</h3>
      </div>

      {/* Topic Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topic or Category
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Monday mornings, coding bugs, coffee addiction..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={isGenerating}
        />
      </div>

      {/* Vibe Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose Vibe
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => setSelectedVibe(vibe.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedVibe === vibe.id
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
              disabled={isGenerating}
            >
              <span>{vibe.emoji}</span>
              <span>{vibe.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateCaptions}
        disabled={isGenerating || !prompt.trim()}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          isGenerating || !prompt.trim()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 inline-block animate-spin mr-2" />
            Generating Captions...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 inline-block mr-2" />
            Generate 5 Captions
          </>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Generated Captions */}
      {captions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Generated Captions (Click to use):
          </h4>
          <div className="space-y-2">
            {captions.map((caption, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleCaptionClick(caption)}
              >
                <p className="text-sm text-gray-800 flex-1 pr-2">{caption}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(caption);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-700 transition-opacity"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AICaptionGenerator;