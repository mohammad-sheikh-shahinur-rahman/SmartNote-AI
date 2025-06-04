
'use client';

import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/translations';
import React, { useEffect } from 'react';
import Image from 'next/image';

const AboutAppPage = () => {
  const { language } = useLanguage();
  const t = getTranslations(language);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = t.aboutAppPageTitleMeta;
    }
  }, [language, t]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto shadow-xl bg-card text-card-foreground rounded-lg">
          <CardHeader className="text-center pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <Image
                src="https://placehold.co/100x100.png" 
                alt="SmartNote AI Logo"
                width={100}
                height={100}
                className="rounded-lg shadow-md"
                data-ai-hint="app logo"
              />
            </div>
            <CardTitle className="text-3xl font-headline text-primary mb-1">{t.aboutAppTitle}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6 md:px-8">
            <p className="text-foreground leading-relaxed text-justify">{t.aboutAppDescription}</p>
            {/* Future sections for features, tech stack, etc. can be added here */}
            {/* 
            <section className="mt-8">
              <h2 className="text-2xl font-semibold font-headline mb-3 text-accent border-b-2 border-accent/30 pb-2">
                {language === 'bn' ? 'প্রধান বৈশিষ্ট্যসমূহ' : 'Key Features'}
              </h2>
              <ul className="list-disc list-inside space-y-1 text-foreground">
                <li>{language === 'bn' ? 'রিচ টেক্সট এডিটিং' : 'Rich Text Editing'}</li>
                <li>{language === 'bn' ? 'এআই-চালিত অটো-টাইটেল' : 'AI-Powered Auto-Titles'}</li>
                <li>{language === 'bn' ? 'নোট সারাংশকরণ' : 'Note Summarization'}</li>
                <li>{language === 'bn' ? 'বহুভাষিক অনুবাদ' : 'Multilingual Translation'}</li>
                <li>{language === 'bn' ? 'ভয়েস ইনপুট' : 'Voice Input'}</li>
              </ul>
            </section>
            <section className="mt-8">
              <h2 className="text-2xl font-semibold font-headline mb-3 text-accent border-b-2 border-accent/30 pb-2">
                {language === 'bn' ? 'ব্যবহৃত প্রযুক্তি' : 'Technology Stack'}
              </h2>
              <p className="text-foreground">
                Next.js, React, ShadCN UI, Tailwind CSS, Genkit (Google AI)
              </p>
            </section>
            */}
          </CardContent>
          <CardFooter className="py-6 justify-center border-t mt-6">
             <Link href="/" className="text-primary hover:underline">
                {t.goBackButton}
              </Link>
          </CardFooter>
        </Card>
      </main>
      <footer className="text-center py-6 border-t text-sm text-muted-foreground">
        {t.footerCopyright.replace('{year}', new Date().getFullYear().toString())}
      </footer>
    </div>
  );
};

export default AboutAppPage;

    