/* Real dashboard with stats and logs */
// AccentShift Frontend (src/pages/Dashboard.jsx)
export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm text-gray-500 mb-1">Total Calls</h2>
          <p className="text-3xl font-bold text-blue-600">120</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm text-gray-500 mb-1">Voice Clones</h2>
          <p className="text-3xl font-bold text-green-600">15</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm text-gray-500 mb-1">Active Assistants</h2>
          <p className="text-3xl font-bold text-indigo-600">3</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
          <li className="p-4">✅ You cloned a new voice - "Michael US"</li>
          <li className="p-4">🎤 AI Assistant answered a call from +1 425-233...</li>
          <li className="p-4">📦 You upgraded to Pro Plan</li>
        </ul>
      </div>
    </div>
  );
}
