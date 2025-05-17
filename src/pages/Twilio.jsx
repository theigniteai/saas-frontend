/* Real Twilio UI with lead uploader */

// AccentShift Frontend (src/pages/Twilio.jsx)
import { useState } from 'react';

export default function Twilio() {
  const [number, setNumber] = useState('');
  const [leads, setLeads] = useState([]);

  const handleLeadsUpload = (e) => {
    const file = e.target.files[0];
    // TODO: parse and send leads to backend
    console.log('Uploaded:', file);
  };

  const handlePurchase = () => {
    // TODO: call backend to buy number
    alert(`Requested Twilio number: ${number}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Twilio Integration</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl space-y-4">
        <div>
          <label className="block font-semibold mb-1">Buy a Twilio Number</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="e.g. US, UK, etc."
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handlePurchase}
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Buy Number
          </button>
        </div>

        <div>
          <label className="block font-semibold mb-1">Upload Lead List (CSV)</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleLeadsUpload}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>
    </div>
  );
}
