// src/pages/AgentPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AgentPanel = () => {
  const [prompt, setPrompt] = useState("");
  const [voice, setVoice] = useState("eleven_en_us_male");
  const [assignedNumber, setAssignedNumber] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [callLogs, setCallLogs] = useState([]);

  const backendUrl = "https://saas-backend-ffcf.onrender.com";
  const userId = "681e3a18f70ab9693a7cd5fd"; // ✅ Use correct MongoDB ObjectId here

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${backendUrl}/ai-agent/settings`, {
        params: { userId },
      });
      const data = res.data;
      setPrompt(data.prompt || "");
      setVoice(data.voice || "eleven_en_us_male");
      setAssignedNumber(data.assignedNumber || "");
      setEnabled(data.enabled || false);
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${backendUrl}/ai-agent/logs`, {
        params: { userId },
      });
      setCallLogs(res.data || []);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    }
  };

  const saveSettings = async () => {
    try {
      console.log("Saving with userId:", userId);
      await axios.post(`${backendUrl}/ai-agent/settings`, {
        prompt,
        voice,
        assignedNumber,
        enabled,
        userId
      });
      alert("Agent settings saved!");
    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
      alert("Failed to save settings.");
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">🤖 AI Calling Agent Panel</h2>

      <div className="space-y-5 bg-white p-5 rounded-xl shadow-sm border">
        <div>
          <label className="block font-medium mb-1">Agent Prompt</label>
          <textarea
            className="w-full border rounded-md p-3"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Greet the caller and ask how you can help..."
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Voice ID</label>
          <input
            type="text"
            className="w-full border rounded-md p-3"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            placeholder="e.g., eleven_en_us_male"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Twilio Number</label>
          <input
            type="text"
            className="w-full border rounded-md p-3"
            value={assignedNumber}
            onChange={(e) => setAssignedNumber(e.target.value)}
            placeholder="+1XXXXXXXXXX"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
          />
          <label className="text-sm font-medium">Enable Agent</label>
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
          <p className="text-gray-500">No call logs yet.</p>
        ) : (
          <div className="space-y-4">
            {callLogs.map((log, i) => (
              <div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
                <p><strong>📱 From:</strong> {log.from}</p>
                <p><strong>🗣️ Caller Said:</strong> {log.userSpeech}</p>
                <p><strong>🤖 Agent Replied:</strong> {log.aiReply}</p>
                {log.recordingUrl && (
                  <audio controls src={`${log.recordingUrl}.mp3`} className="mt-2" />
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

export default AgentPanel;
