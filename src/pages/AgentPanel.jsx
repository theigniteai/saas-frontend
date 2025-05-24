// AgentPanel.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AgentPanel = () => {
  const [prompt, setPrompt] = useState("");
  const [voiceId, setVoiceId] = useState("eleven_en_us_male");
  const [twilioNumber, setTwilioNumber] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing agent settings on mount
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_URL}/ai-agent/settings`);
        setPrompt(res.data.prompt || "");
        setVoiceId(res.data.voiceId || "eleven_en_us_male");
        setTwilioNumber(res.data.assignedNumber || "");
        setIsEnabled(res.data.isEnabled || false);
      } catch (err) {
        console.error("Failed to fetch settings", err.message);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        userId: "test_user_123", // hardcoded
        prompt,
        assignedNumber: twilioNumber,
        voiceId,
        isEnabled,
      };

      await axios.post(`${API_URL}/ai-agent/settings`, payload);
      alert("✅ Settings saved successfully");
    } catch (err) {
      console.error("Save error:", err.message);
      alert("❌ Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg mt-10 space-y-4">
      <h2 className="text-xl font-semibold">🤖 AI Agent Settings</h2>

      <div>
        <label className="block font-medium mb-1">Prompt</label>
        <textarea
          className="w-full border p-2 rounded"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Twilio Number</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={twilioNumber}
          onChange={(e) => setTwilioNumber(e.target.value)}
          placeholder="+1..."
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Voice ID (ElevenLabs)</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
        />
        <label>Enable AI Agent</label>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default AgentPanel;
