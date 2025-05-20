import React, { useEffect, useState } from "react";
import axios from "axios";

const AIAgent = () => {
  const [prompt, setPrompt] = useState("");
  const [voice, setVoice] = useState("eleven_en_us_male");
  const [assignedNumber, setAssignedNumber] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [callLogs, setCallLogs] = useState([]);

  const backendUrl = "https://your-backend-url.onrender.com"; // ← CHANGE THIS

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${backendUrl}/ai-agent/settings`);
      const data = res.data;
      setPrompt(data.prompt || "");
      setVoice(data.voice || "");
      setAssignedNumber(data.assignedNumber || "");
      setEnabled(data.enabled || false);
    } catch (error) {
      console.error("Failed to fetch agent settings");
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${backendUrl}/ai-agent/logs`);
      setCallLogs(res.data || []);
    } catch (error) {
      console.error("Failed to fetch call logs");
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
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings.");
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🤖 AI Calling Agent</h2>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <label className="block font-semibold mb-1">Agent Prompt</label>
          <textarea
            rows="4"
            className="w-full border rounded-md p-3"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Greet the caller and ask what service they’re looking for."
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Voice ID (ElevenLabs)</label>
          <input
            type="text"
            className="w-full border rounded-md p-3"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            placeholder="e.g., eleven_en_us_male"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Assigned Twilio Number</label>
          <input
            type="text"
            className="w-full border rounded-md p-3"
            value={assignedNumber}
            onChange={(e) => setAssignedNumber(e.target.value)}
            placeholder="+1415XXXXXXX"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
          />
          <label className="font-medium">Enable AI Agent</label>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          onClick={saveSettings}
        >
          Save Agent Settings
        </button>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">📞 Call Logs</h3>
        {callLogs.length === 0 ? (
          <p className="text-gray-500">No call logs found.</p>
        ) : (
          <ul className="space-y-4">
            {callLogs.map((log, index) => (
              <li key={index} className="border p-4 rounded-md shadow-sm bg-white">
                <p><strong>From:</strong> {log.from}</p>
                <p><strong>User Said:</strong> {log.userSpeech}</p>
                <p><strong>AI Replied:</strong> {log.aiReply}</p>
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AIAgent;
