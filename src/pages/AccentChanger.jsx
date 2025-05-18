import { useEffect, useRef, useState } from 'react';

export default function AccentChanger() {
  const [selectedAccent, setSelectedAccent] = useState('en-US');
  const [recording, setRecording] = useState(false);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const relayUrl = 'wss://accentshift-relay.up.railway.app/';

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    };
  }, []);

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 128000,
      });

      const socket = new WebSocket(relayUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
        setRecording(true);
        mediaRecorder.start(250); // send every 250ms
      };

      socket.onmessage = async (event) => {
        if (event.data instanceof Blob) {
          const audioBlob = new Blob([event.data], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);

          const audio = audioRef.current;
          audio.src = audioUrl;
          try {
            await audio.play();
          } catch (err) {
            console.error('Playback error:', err);
          }
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setRecording(false);
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 1024 && socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        } else {
          console.warn('Skipping small chunk');
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      socketRef.current = socket;
    } catch (err) {
      console.error('Mic access error:', err);
    }
  };

  const handleStop = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (socketRef.current) socketRef.current.close();
    setRecording(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Accent Changer</h2>

      <label className="block mb-2 font-medium">Select Accent</label>
      <select
        className="w-full border p-2 rounded mb-4"
        value={selectedAccent}
        onChange={(e) => setSelectedAccent(e.target.value)}
      >
        <option value="en-US">🇺🇸 English (US)</option>
        <option value="en-GB">🇬🇧 English (UK)</option>
        <option value="en-AU">🇦🇺 English (AUS)</option>
        <option value="en-IN">🇮🇳 English (India)</option>
      </select>

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

      <audio ref={audioRef} controls className="mt-4 w-full" />
    </div>
  );
}
