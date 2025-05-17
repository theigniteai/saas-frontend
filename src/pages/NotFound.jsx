// AccentShift Frontend (src/pages/NotFound.jsx)
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-blue-700 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">Page not found. The page you're looking for doesn’t exist or has been moved.</p>
      <a href="/" className="text-blue-600 hover:underline">Return to Home</a>
    </div>
  );
}
