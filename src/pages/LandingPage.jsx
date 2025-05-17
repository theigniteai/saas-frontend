/* Button to enter dashboard */
// AccentShift Frontend (src/pages/LandingPage.jsx)
export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome to AccentShift</h1>
        <p className="text-lg opacity-90">
          Your AI-powered voice transformation dashboard. Access real-time accent changing, voice cloning,
          AI assistance, and Twilio communication — all in one place.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-gray-100"
        >
          Enter Dashboard
        </a>
      </div>
    </div>
  );
}
