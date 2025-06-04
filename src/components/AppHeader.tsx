
'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const AppHeader = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = getTranslations(language);

  const buttonText = language === 'en' ? t.toggleToEnglish : t.toggleToBangla;

  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">{t.appTitle}</h1>
        <div className="flex items-center gap-2">
          <Link href="/about" passHref legacyBehavior>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary/80"
              aria-label={t.developerPageLinkTooltip}
              title={t.developerPageLinkTooltip}
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
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
