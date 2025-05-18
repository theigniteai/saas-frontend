import { useEffect, useRef, useState } from "react";

export default function AccentChanger() {
  const [selectedAccent, setSelectedAccent] = useState("en-US");
  const [recording, setRecording] = useState(false);
  const ws = useRef(null);
  const mediaRecorder = useRef(null);
  const audioPlayer = useRef(null);

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      ws.current = new WebSocket("wss://accentshift-relay.up.railway.app");

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        mediaRecorder.current = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });

        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(event.data);
          }
        };

        mediaRecorder.current.start(500); // send chunks every 500ms
        setRecording(true);
      };

      ws.current.onmessage = async (event) => {
        const audioBlob = new Blob([event.data], { type: "audio/mpeg" });

        // Validate audio blob size before playing
        if (audioBlob.size < 1000) {
          console.warn("Received too small audio chunk, skipping...");
          return;
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioPlayer.current) {
          audioPlayer.current.pause();
          audioPlayer.current.src = audioUrl;
          audioPlayer.current.load();
          audioPlayer.current.play().catch((e) =>
            console.error("Playback failed:", e)
          );
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
      };
    } catch (err) {
      console.error("Mic error:", err.message);
      alert("Microphone access is required to use Accent Changer.");
    }
  };

  const handleStop = () => {
    setRecording(false);
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    if (ws.current) {
      ws.current.close();
    }
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

        <audio ref={audioPlayer} controls className="w-full mt-4" />
        {recording && (
          <p className="text-sm text-gray-600">
            🎙️ Live accent relay started...
          </p>
        )}
      </div>
    </div>
  );
}
