import React, { useState, useRef } from 'react';

export default function AccentChanger() {
  const [selectedAccent, setSelectedAccent] = useState('en-US');
  const [recording, setRecording] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);

  const handleStart = async () => {
    setRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus',
    });

    const socket = new WebSocket('wss://accentshift-relay.up.railway.app');

    socketRef.current = socket;
    mediaRecorderRef.current = mediaRecorder;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onmessage = async (event) => {
      const data = event.data;
      if (!data || data.length < 500) {
        console.warn('⚠️ Received too small audio chunk, skipping...');
        return;
      }

      const blob = new Blob([data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = audioRef.current;
      audio.pause();
      audio.src = url;
      audio.load();
      audio.play().catch((err) => {
        console.error('Playback failed:', err);
      });
    };

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 200) {
        socket.send(e.data);
      } else {
        console.warn('Skipping small chunk');
      }
    };

    mediaRecorder.start(800); // Record in 800ms chunks
    console.log('Recording started');
  };

  const handleStop = () => {
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    console.log('Recording stopped');
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

        <audio ref={audioRef} controls className="w-full mt-4" />
      </div>
    </div>
  );
}
