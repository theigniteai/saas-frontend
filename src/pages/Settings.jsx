/* Real profile form */
// AccentShift Frontend (src/pages/Settings.jsx)
import { useState } from 'react';

export default function Settings() {
  const [email, setEmail] = useState('user@accentshift.com');
  const [name, setName] = useState('AccentShift User');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    // TODO: update profile details
    alert('Settings saved!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile & Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
