/* Real dropdown and stream controls */
// AccentShift Frontend (src/pages/AccentChanger.jsx)
import { useState } from 'react';

export default function AccentChanger() {
  const [selectedAccent, setSelectedAccent] = useState('en-US');
  const [recording, setRecording] = useState(false);

  const handleStart = () => {
    setRecording(true);
    // TODO: integrate mic stream to backend relay
  };

  const handleStop = () => {
    setRecording(false);
    // TODO: stop stream
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Accent Changer</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Select Accent</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedAccent}
            onChange={(e) => setSelectedAccent(e.target.value)}
          >
            <option value="en-US">🇺🇸 English (US)</option>
            <option value="en-GB">🇬🇧 English (UK)</option>
            <option value="en-AU">🇦🇺 English (AUS)</option>
            <option value="en-IN">🇮🇳 English (India)</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleStart}
            disabled={recording}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Start Accent Live
          </button>
          <button
            onClick={handleStop}
            disabled={!recording}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Stop
          </button>
        </div>

        {recording && <p className="text-sm text-gray-600">🎙️ Live accent relay started...</p>}
      </div>
    </div>
  );
} 
