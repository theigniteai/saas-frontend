import React, { useEffect, useState } from "react";
import axios from "axios";

const AIAgent = () => {
  const [prompt, setPrompt] = useState("");
  const [voice, setVoice] = useState("eleven_en_us_male");
  const [assignedNumber, setAssignedNumber] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [callLogs, setCallLogs] = useState([]);

  const backendUrl = "https://your-backend-url.onrender.com"; // change this

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${backendUrl}/ai-agent/settings`);
      if (res.data) {
        setPrompt(res.data.prompt || "");
        setVoice(res.data.voice || "");
        setAssignedNumber(res.data.assignedNumber || "");
        setEnabled(res.data.enabled || false);
      }
    } catch (err) {
      console.error("Fetch settings error:", err.message);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${backendUrl}/ai-agent/logs`);
      setCallLogs(res.data || []);
    } catch (err) {
      console.error("Fetch logs error:", err.message);
    }
  };

  const saveSettings = async () => {
    try {
      await axios.post(`${backendUrl}/ai-agent/settings`, {
        prompt,
        voice,
        assignedNumber,
        enabled,
      });
      alert("Agent settings saved!");
    } catch (err) {
      alert("Failed to save settings.");
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">🤖 AI Calling Agent Settings</h2>

      <div className="space-y-5 bg-white p-5 rounded-xl shadow-sm border">
        <div>
          <label className="block font-medium mb-1">Agent Prompt</label>
          <textarea
            className="w-full border rounded-md p-3"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Greet the user and ask what service they’re looking for..."
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Voice ID (ElevenLabs)</label>
          <input
            type="text"
            className="w-full border rounded-md p-3"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            placeholder="e.g., eleven_en_us_male"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Assigned Twilio Number</label>
          <input
            type="text"
            className="w-full border rounded-md p-3"
            value={assignedNumber}
            onChange={(e) => setAssignedNumber(e.target.value)}
            placeholder="+14151234567"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
          />
          <label className="text-sm font-medium">Enable AI Agent</label>
        </div>

        <button
          onClick={saveSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
        >
          Save Agent Settings
        </button>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">📞 Call Logs</h3>

        {callLogs.length === 0 ? (
          <p className="text-gray-500">No call logs found yet.</p>
        ) : (
          <div className="space-y-4">
            {callLogs.map((log, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <p><strong>📱 From:</strong> {log.from}</p>
                <p><strong>🗣️ Caller Said:</strong> {log.userSpeech}</p>
                <p><strong>🤖 Agent Replied:</strong> {log.aiReply}</p>
                {log.recordingUrl && (
                  <audio
                    controls
                    src={`${log.recordingUrl}.mp3`}
                    className="mt-2"
                  />
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgent;
