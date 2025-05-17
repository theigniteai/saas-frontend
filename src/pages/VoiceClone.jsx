/* Upload + preview voice interface */
// AccentShift Frontend (src/pages/VoiceClone.jsx)
import { useState } from 'react';

export default function VoiceClone() {
  const [recording, setRecording] = useState(false);
  const [file, setFile] = useState(null);
  const [voiceId, setVoiceId] = useState('');
  const [previewText, setPreviewText] = useState('Hello! This is your cloned voice.');

  const handleUpload = (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);
    // TODO: Upload to backend and receive voiceId
  };

  const handleGenerate = () => {
    // TODO: Send previewText + voiceId to backend and receive audio
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Voice Clone</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl space-y-5">
        <div>
          <label className="block font-semibold mb-1">Upload your voice sample</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleUpload}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Preview Text</label>
          <textarea
            rows={3}
            className="w-full border p-2 rounded"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Preview Cloned Voice
        </button>

        {/* TODO: Render audio response */}
      </div>
    </div>
  );
}
