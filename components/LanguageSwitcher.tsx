"use client";
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 font-semibold transition ${
          language === 'en'
            ? 'bg-red-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('th')}
        className={`px-4 py-2 font-semibold transition ${
          language === 'th'
            ? 'bg-red-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        ไทย
      </button>
    </div>
  );
}
