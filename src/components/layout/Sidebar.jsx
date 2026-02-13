import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Mail,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { to: '/invoices', icon: FileText, labelKey: 'nav.invoices' },
  { to: '/email-bot', icon: Mail, labelKey: 'nav.emailBot' },
  { to: '/settings', icon: Settings, labelKey: 'nav.settings' },
];

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="fixed left-0 top-0 w-64 min-h-screen bg-primary-950 flex flex-col z-30">
      {/* Logo / App Title */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/15">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-semibold text-lg leading-tight">AP Automation</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
                isActive
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-white/40 text-xs">v1.0 Demo</p>
      </div>
    </aside>
  );
}
