
'use client';

import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';

const AppHeader = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = getTranslations(language);

  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">{t.appTitle}</h1>
        <div className="flex items-center gap-2">
          <Button onClick={toggleLanguage} variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80">
            {language === 'en' ? t.toggleToBangla : t.toggleToEnglish}
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
