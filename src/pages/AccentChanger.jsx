// AccentShift Frontend (src/pages/AccentChanger.jsx)
import { useEffect, useRef, useState } from "react";

export default function AccentChanger() {
  const [selectedAccent, setSelectedAccent] = useState("en-US");
  const [recording, setRecording] = useState(false);
  const audioRef = useRef(null);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (!recording) return;

    const startStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const socket = new WebSocket("wss://accentshift-relay.up.railway.app");

      socketRef.current = socket;
      mediaRecorderRef.current = mediaRecorder;

      socket.onopen = () => {
        console.log("🎤 WebSocket connected");
      };

      socket.onmessage = (event) => {
        if (audioRef.current && event.data instanceof Blob) {
          const audioBlob = new Blob([event.data], { type: "audio/mpeg" });
          const audioURL = URL.createObjectURL(audioBlob);
          audioRef.current.src = audioURL;
          audioRef.current.play();
        }
      };

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(e.data);
        }
      };

      mediaRecorder.start(300); // send audio chunks every 300ms
    };

    startStream();

    return () => {
      mediaRecorderRef.current?.stop();
      socketRef.current?.close();
    };
  }, [recording]);

  const handleStart = () => {
    setRecording(true);
  };

  const handleStop = () => {
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
