// AccentShift Frontend (src/pages/AIAssistant.jsx)
import { useState } from 'react';
import axios from 'axios';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAudioUrl('');

    try {
      const res = await axios.post('https://saas-backend-ffc.onrender.com/ai/respond', {
        prompt,
        voice_id: 'en-US-Standard-C',
      });
      setAudioUrl(res.data.audio_url);
    } catch (err) {
      console.error('AI Assistant Error:', err);
      alert('AI Assistant failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">AI Assistant</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4 max-w-xl">
        <textarea
          className="w-full border border-gray-300 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Ask anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Ask AI'}
        </button>
      </form>

      {audioUrl && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow max-w-xl">
          <h2 className="font-semibold mb-2">AI Response</h2>
          <audio controls src={`https://saas-backend-ffc.onrender.com${audioUrl}`} className="w-full" />
        </div>
      )}
    </div>
  );
}
