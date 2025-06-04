
'use client';

import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';

const AppHeader = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = getTranslations(language);

  // Determine the text for the button based on the user's desired logic:
  // If current language is English, button shows "EN". Clicking switches to Bangla.
  // If current language is Bangla, button shows "BN" (or "বাং"). Clicking switches to English.
  const buttonText = language === 'en' ? t.toggleToEnglish : t.toggleToBangla;
  
  // Determine the tooltip/aria-label to indicate the action
  // If current language is English (button shows "EN"), action is to switch to Bangla.
  // If current language is Bangla (button shows "বাং"), action is to switch to English.
  const actionTooltip = language === 'en' ? (getTranslations('bn').appTitle) : (getTranslations('en').appTitle);
  // This is a bit tricky because the tooltip should ideally be in the current language but describe the target.
  // For simplicity, we can use specific keys if available or construct it.
  // Let's refine the text to clearly indicate "Switch to [Target Language Name]"
  // The existing t.toggleToBangla and t.toggleToEnglish are short ("BN", "EN", "বাং")
  // Let's assume they are sufficient for the button text for now.
  // The user's main point was the button text relative to the action.

  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">{t.appTitle}</h1>
        <div className="flex items-center gap-2">
          <Button 
            onClick={toggleLanguage} 
            variant="ghost" 
            size="sm" 
            className="text-primary-foreground hover:bg-primary/80"
            aria-label={language === 'en' ? `Switch to ${getTranslations('bn').languageName}` : `Switch to ${getTranslations('en').languageName}`}
            title={language === 'en' ? `Switch to ${getTranslations('bn').languageName}` : `Switch to ${getTranslations('en').languageName}`}
          >
            {buttonText}
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

