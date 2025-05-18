import { useState, useRef } from "react";

export default function AccentChanger() {
  const [selectedAccent, setSelectedAccent] = useState("en-US");
  const [recording, setRecording] = useState(false);
  const audioRef = useRef(null);
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startStreaming = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const ws = new WebSocket("wss://accentshift-relay.up.railway.app/");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (ws.readyState === WebSocket.OPEN && e.data.size > 0) {
          ws.send(e.data);
        }
      };

      mediaRecorder.start(250);
    };

    ws.onmessage = async (event) => {
      const audioBlob = new Blob([event.data], { type: "audio/mpeg" });

      if (audioBlob.size < 1000) {
        console.warn("Received too small audio chunk, skipping...");
        return;
      }

      const url = URL.createObjectURL(audioBlob);
      const audio = audioRef.current;

      try {
        audio.pause();
        audio.src = url;
        audio.load();
        await audio.play();
      } catch (err) {
        console.error("Playback failed:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  };

  const stopStreaming = () => {
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const handleStart = () => {
    setRecording(true);
    startStreaming();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Accent Changer</h1>
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
            onClick={stopStreaming}
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
