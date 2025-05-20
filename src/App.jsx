// AccentShift Frontend (src/App.jsx)
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import AIAgent from './pages/AIAgent';
import AccentChanger from './pages/AccentChanger';
import VoiceClone from './pages/VoiceClone';
import Twilio from './pages/Twilio';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/*"
        element={
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-grow p-6">
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
               <Route path="agent-panel" element={<AgentPanel />} />
                <Route path="accent-changer" element={<AccentChanger />} />
                <Route path="voice-clone" element={<VoiceClone />} />
                <Route path="twilio" element={<Twilio />} />
                <Route path="billing" element={<Billing />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}
