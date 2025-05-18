// src/pages/AccentChanger.jsx
import React, { useState, useRef } from "react";

const AccentChanger = () => {
  const [recording, setRecording] = useState(false);
  const [selectedAccent, setSelectedAccent] = useState("en-US");
  const audioPlayer = useRef(null);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const socket = new WebSocket("wss://accentshift-relay.up.railway.app/");

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = async (event) => {
      const data = event.data;

      if (data instanceof Blob && data.size > 1000) {
        const audioBlob = new Blob([data], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioPlayer.current) {
          audioPlayer.current.pause();
          audioPlayer.current.src = audioUrl;
          audioPlayer.current.load();
          audioPlayer.current.play().catch((e) => console.error("Playback error:", e));
        }
      } else {
        console.warn("Received too small audio chunk, skipping...");
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = async (e) => {
      if (socket.readyState === WebSocket.OPEN && e.data.size > 0) {
        socket.send(e.data);
      }
    };

    mediaRecorder.start(200); // send chunk every 200ms
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Accent Changer</h1>

      <div className="bg-white p-6 rounded shadow max-w-xl space-y-4">
        <div>
          <label className="block mb-2 font-medium">Select Accent</label>
          <select
            className="w-full border p-2 rounded"
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

        <audio ref={audioPlayer} controls className="w-full mt-4" />
        {recording && (
          <p className="text-sm text-gray-500">🎙️ Streaming live... Speak now.</p>
        )}
      </div>
    </div>
  );
};

export default AccentChanger;
