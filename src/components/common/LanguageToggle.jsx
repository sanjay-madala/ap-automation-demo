import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  const toggleLanguage = () => {
    i18n.changeLanguage(isEnglish ? 'th' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors duration-200"
      aria-label="Toggle language"
    >
      <span className="text-base">{isEnglish ? '\u{1F1FA}\u{1F1F8}' : '\u{1F1F9}\u{1F1ED}'}</span>
      <span>{isEnglish ? 'EN' : 'TH'}</span>
    </button>
  );
}
