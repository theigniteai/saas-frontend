/* Real subscription summary UI */
// AccentShift Frontend (src/pages/Billing.jsx)
export default function Billing() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Billing Overview</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl">
        <p className="mb-3">You are currently on the <strong>Pro Plan</strong>.</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Manage Subscription</button>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Payment History</h2>
        <ul className="bg-white rounded-lg shadow divide-y divide-gray-200">
          <li className="p-4">💳 01 May 2025 — $49 — Pro Plan</li>
          <li className="p-4">💳 01 April 2025 — $49 — Pro Plan</li>
        </ul>
      </div>
    </div>
  );
}
