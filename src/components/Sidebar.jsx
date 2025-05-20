import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUserSecret,
  FaMagic,
  FaClone,
  FaPhone,
  FaCreditCard,
  FaCog
} from 'react-icons/fa';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { path: '/agent-panel', label: 'Agent Panel', icon: <FaUserSecret /> },         // ✅ Merged AI module
  { path: '/twilio', label: 'Twilio', icon: <FaPhone /> },
  { path: '/accent-changer', label: 'Accent Changer', icon: <FaMagic /> },
  { path: '/voice-clone', label: 'Voice Clone', icon: <FaClone /> },
  { path: '/billing', label: 'Billing', icon: <FaCreditCard /> },
  { path: '/settings', label: 'Settings', icon: <FaCog /> },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md h-screen p-4">
      <h2 className="text-xl font-bold mb-6">AccentShift</h2>
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
