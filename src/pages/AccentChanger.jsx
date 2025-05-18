// src/pages/AccentChanger.jsx
import { useEffect, useRef, useState } from 'react';

export default function AccentChanger() {
  const [selectedAccent, setSelectedAccent] = useState('en-US');
  const [recording, setRecording] = useState(false);
  const wsRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const WEBSOCKET_URL = 'wss://accentshift-relay.up.railway.app/';

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 32000,
      });

      wsRef.current = new WebSocket(WEBSOCKET_URL);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        recorder.start(250); // send chunks every 250ms
        setRecording(true);
      };

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(event.data);
        }
      };

      wsRef.current.onmessage = async (event) => {
        const audioBlob = new Blob([event.data], { type: 'audio/mpeg' });

        if (audioBlob.size < 100) {
          console.warn('⚠️ Received too small audio chunk, skipping...');
          return;
        }

        const audioURL = URL.createObjectURL(audioBlob);
        audioPlayerRef.current.src = audioURL;
        try {
          await audioPlayerRef.current.play();
        } catch (err) {
          console.error('❌ Playback failed:', err);
        }
      };

      wsRef.current.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setRecording(false);
      };

      mediaRecorderRef.current = recorder;
    } catch (err) {
      console.error('❌ Microphone access error:', err);
    }
  };

  const handleStop = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    setRecording(false);
  };

  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Accent Changer</h1>
      <div className="bg-white p-6 rounded shadow max-w-xl space-y-4">
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
        <audio ref={audioPlayerRef} controls className="w-full mt-4" />
        {recording && <p className="text-sm text-gray-600">🎙️ Live accent streaming...</p>}
      </div>
    </div>
  );
}
