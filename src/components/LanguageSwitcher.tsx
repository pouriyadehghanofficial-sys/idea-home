import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../data/defaultContent';

interface LanguageSwitcherProps {
  variant?: 'header' | 'mobile' | 'floating' | 'admin';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage, dir } = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Mobile drawer variant: 3 clean full-width pill buttons
  if (variant === 'mobile') {
    return (
      <div className={`w-full py-2 ${className}`}>
        <div className="flex items-center gap-2 mb-2 px-1 text-xs text-[#EDEAE4]/70 font-vazir">
          <Globe className="w-3.5 h-3.5 text-[#C9A24B]" />
          <span>زبان سایت / Website Language / لغة الموقع:</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                type="button"
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`py-2.5 px-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#C9A24B] text-[#1E4B57] border-[#C9A24B] shadow-md'
                    : 'bg-[#EDEAE4]/[0.06] text-[#EDEAE4]/85 border-[#7FA69C]/25 hover:bg-[#EDEAE4]/[0.12] hover:text-[#EDEAE4]'
                }`}
                title={lang.name}
              >
                <span className="leading-tight font-vazir font-bold">{lang.nativeName}</span>
                <span className="text-[10px] opacity-75 font-normal">{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Admin variant: Sleek segmented bar
  if (variant === 'admin') {
    return (
      <div className={`inline-flex items-center bg-[#123038] border border-[#C9A24B]/30 rounded-lg p-0.5 gap-1 ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = lang.code === language;
          return (
            <button
              type="button"
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#C9A24B] text-[#1E4B57] shadow-xs'
                  : 'text-[#EDEAE4]/70 hover:text-[#EDEAE4] hover:bg-white/5'
              }`}
            >
              <span>{lang.nativeName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Header desktop variant: Luxury dropdown with current language native name & globe icon
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDEAE4]/[0.08] hover:bg-[#EDEAE4]/[0.15] border border-[#7FA69C]/30 text-xs font-bold text-[#EDEAE4] transition-all cursor-pointer shadow-xs active:scale-97 group"
        aria-label="تغییر زبان سایت"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#C9A24B] group-hover:rotate-45 transition-transform duration-300" />
        <span className="font-vazir text-xs">{currentLang.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-[#EDEAE4]/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full mt-2 w-44 rounded-2xl bg-[#1E4B57]/95 backdrop-blur-xl border border-[#C9A24B]/30 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
            dir === 'rtl' ? 'left-0' : 'right-0'
          }`}
        >
          <div className="space-y-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-vazir transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#C9A24B] text-[#1E4B57] font-black shadow-xs'
                      : 'text-[#EDEAE4] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col text-start">
                    <span className="font-bold leading-tight">{lang.nativeName}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-[#1E4B57]/80' : 'text-[#EDEAE4]/60'}`}>
                      {lang.name}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#1E4B57]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
