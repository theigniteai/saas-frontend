import React, { useEffect, useRef, useState } from "react";

export default function AccentChanger() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [accent, setAccent] = useState("us");
  const socketRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);

  const WS_URL = "wss://accentshift-relay.up.railway.app/";

  const startStream = async () => {
    setIsStreaming(true);
    socketRef.current = new WebSocket(WS_URL);

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
      socketRef.current.send(JSON.stringify({ type: "start", accent }));

      setTimeout(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        sourceRef.current = source;

        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          const input = e.inputBuffer.getChannelData(0);
          if (!input.some((val) => val !== 0)) return; // skip silent chunks
          const int16 = new Int16Array(input.length);
          for (let i = 0; i < input.length; i++) {
            int16[i] = input[i] * 32767;
          }
          if (socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(int16);
          } else {
            console.warn("⚠️ Tried to send while socket not open");
          }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
      }, 500); // small delay after socket opens
    };

    socketRef.current.onmessage = (event) => {
      const blob = new Blob([event.data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    };
  };

  const stopStream = () => {
    setIsStreaming(false);

    if (processorRef.current) processorRef.current.disconnect();
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: "stop" }));
      }
      socketRef.current.close();
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-lg space-y-4">
      <h2 className="text-xl font-semibold">🎤 Accent Changer (Live)</h2>

      <label className="block mb-1 font-medium">Select Accent</label>
      <select
        value={accent}
        onChange={(e) => setAccent(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="us">🇺🇸 American</option>
        <option value="uk">🇬🇧 British</option>
        <option value="aus">🇦🇺 Australian</option>
      </select>

      <div className="flex gap-4 pt-2">
        <button
          onClick={startStream}
          disabled={isStreaming}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Start Accent Live
        </button>
        <button
          onClick={stopStream}
          disabled={!isStreaming}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
