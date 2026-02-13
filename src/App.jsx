import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n';
import Layout from './components/layout/Layout';

// Lazy-loaded page components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const InvoiceListPage = lazy(() => import('./pages/InvoiceListPage'));
const EmailBotPage = lazy(() => import('./pages/EmailBotPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="/invoices"
            element={
              <Suspense fallback={<PageLoader />}>
                <InvoiceListPage />
              </Suspense>
            }
          />
          <Route
            path="/email-bot"
            element={
              <Suspense fallback={<PageLoader />}>
                <EmailBotPage />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <SettingsPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
