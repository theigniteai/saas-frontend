// AccentShift Frontend (src/pages/AIAssistant.jsx)
import { useState } from 'react';
import api from '../api';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAudioUrl('');

    try {
      const res = await api.post('/ai/respond', {
        prompt,
        voice_id: 'en-US-Standard-C',
      });

      if (res.data?.audio_url) {
        setAudioUrl(`${import.meta.env.VITE_BACKEND_URL}${res.data.audio_url}`);
      } else {
        alert('No audio received.');
      }
    } catch (err) {
      console.error('AI Assistant Error:', err.message);
      alert('AI Assistant failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask something..."
          className="w-full h-28 p-3 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {audioUrl && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">AI Voice Response:</h4>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
