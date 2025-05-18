// src/pages/AIAgent.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function AIAgent() {
  const [input, setInput] = useState('');
  const [responseUrl, setResponseUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentEnabled, setAgentEnabled] = useState(true);
  const [selectedAccent, setSelectedAccent] = useState('us');
  const audioRef = useRef(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    setResponseUrl('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/ai/respond`, {
        text: input,
        accent: selectedAccent
      });

      const blob = new Blob([res.data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setResponseUrl(url);

      setTimeout(() => {
        audioRef.current?.load();
        audioRef.current?.play();
      }, 300);
    } catch (err) {
      console.error("AI Agent Error:", err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Assistant Agent</h1>

      <div className="space-y-4 bg-white p-6 shadow rounded">
        <label className="block font-semibold">User Message</label>
        <textarea
          className="w-full border border-gray-300 p-3 rounded"
          rows={4}
          placeholder="Type a question or message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="font-medium">Voice:</label>
            <select
              className="border border-gray-300 p-2 rounded"
              value={selectedAccent}
              onChange={(e) => setSelectedAccent(e.target.value)}
            >
              <option value="us">🇺🇸 English (US)</option>
              <option value="uk">🇬🇧 English (UK)</option>
              <option value="aus">🇦🇺 English (AUS)</option>
              <option value="ind">🇮🇳 English (India)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label>Enable Agent</label>
            <input
              type="checkbox"
              checked={agentEnabled}
              onChange={() => setAgentEnabled(!agentEnabled)}
              className="accent-blue-600"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !agentEnabled}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Response'}
        </button>

        {responseUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Voice Response:</p>
            <audio ref={audioRef} controls className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
