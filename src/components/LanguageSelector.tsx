import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, languageNames, Language } from '../contexts/LanguageContext';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-sm border border-slate-600 hover:border-emerald-500/50 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
      >
        <Globe size={18} className="text-emerald-400" />
        <span className="font-medium text-sm">{languageNames[language]}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-600 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-2 border-b border-slate-700">
            <p className="text-xs text-slate-400 font-semibold px-2">Select Language</p>
          </div>
          <div className="py-2">
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelect(lang)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 ${
                  language === lang
                    ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border-l-2 border-emerald-500'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <span className="font-medium">{languageNames[lang]}</span>
                {language === lang && <Check size={16} className="text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
