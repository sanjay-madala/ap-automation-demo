import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Header from './Header';

const routeTitles = {
  '/': 'dashboard.title',
  '/invoices': 'invoices.title',
  '/vendor-portal': 'vendorPortal.title',
  '/email-bot': 'emailBot.title',
  '/settings': 'settings.title',
};

export default function Layout() {
  const { t } = useTranslation();
  const location = useLocation();

  const titleKey = routeTitles[location.pathname] || 'app.title';
  const pageTitle = t(titleKey);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (fixed) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header title={pageTitle} />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
