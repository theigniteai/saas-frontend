// src/pages/AccentChanger.jsx
import { useEffect, useRef, useState } from 'react';

export default function AccentChanger() {
  const [selectedAccent, setSelectedAccent] = useState('us');
  const [recording, setRecording] = useState(false);
  const socketRef = useRef(null);
  const audioRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const relayUrl = 'wss://accentshift-relay.up.railway.app'; // ✅ Your Railway WebSocket URL

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const socket = new WebSocket(relayUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('🔗 WebSocket connected');
        mediaRecorder.start(300); // send audio in chunks every 300ms

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0 && socket.readyState === 1) {
            socket.send(e.data);
          }
        };
      };

      socket.onmessage = (event) => {
        const audioBlob = new Blob([event.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play();
      };

      socket.onerror = (err) => {
        console.error('WebSocket error:', err);
      };

      socket.onclose = () => {
        console.log('🔌 WebSocket disconnected');
      };

      setRecording(true);
    } catch (err) {
      console.error('❌ Microphone access denied or not found:', err);
      alert('Microphone not found. Please connect a mic and allow access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (socketRef.current && socketRef.current.readyState === 1) {
      socketRef.current.close();
    }

    setRecording(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Accent Changer</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Select Accent</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={selectedAccent}
            onChange={(e) => setSelectedAccent(e.target.value)}
          >
            <option value="us">🇺🇸 English (US)</option>
            <option value="gb">🇬🇧 English (UK)</option>
            <option value="au">🇦🇺 English (AUS)</option>
            <option value="in">🇮🇳 English (India)</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={startRecording}
            disabled={recording}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Start Accent Live
          </button>
          <button
            onClick={stopRecording}
            disabled={!recording}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Stop
          </button>
        </div>

        {recording && <p className="text-sm text-gray-600">🎙️ Streaming to AccentRelay...</p>}
      </div>
    </div>
  );
}
