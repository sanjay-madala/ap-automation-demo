import { useTranslation } from 'react-i18next';
import { Search, Bell } from 'lucide-react';
import LanguageToggle from '../common/LanguageToggle';

export default function Header({ title }) {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm border-b h-16 px-6 flex items-center justify-between">
      {/* Left: Page Title */}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search Input (hidden on small screens) */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('header.search')}
            className="pl-9 pr-4 py-2 rounded-lg bg-gray-100 border-0 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white w-64 transition-colors"
          />
        </div>

        {/* Language Toggle */}
        <LanguageToggle />

        {/* Notification Bell */}
        <button
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={t('header.notifications')}
        >
          <Bell className="w-5 h-5" />
          {/* Red dot indicator */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">AU</span>
          </div>
          <span className="hidden lg:block text-sm font-medium text-gray-700">
            {t('header.profile')}
          </span>
        </div>
      </div>
    </header>
  );
}
