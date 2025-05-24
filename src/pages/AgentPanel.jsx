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
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_URL}/ai-agent/settings`);
        setPrompt(res.data.prompt || "");
        setVoiceId(res.data.voiceId || "eleven_en_us_male");
        setTwilioNumber(res.data.assignedNumber || "");
        setIsEnabled(res.data.isEnabled || false);
      } catch (err) {
        console.error("Error fetching agent settings", err.message);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        userId: "test_user_123",
        prompt,
        assignedNumber: twilioNumber,
        voiceId,
        isEnabled,
      };
      await axios.post(`${API_URL}/ai-agent/settings`, payload);
      alert("✅ Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err.message);
      alert("❌ Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-xl font-bold">🎛 AI Agent Settings</h2>

      <div>
        <label className="block font-medium">Prompt</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Twilio Number</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={twilioNumber}
          onChange={(e) => setTwilioNumber(e.target.value)}
          placeholder="+1..."
        />
      </div>

      <div>
        <label className="block font-medium">Voice ID (ElevenLabs)</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default AgentPanel;
