
'use client';

import AppHeader from '@/components/AppHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import type { Metadata } from 'next';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/translations';
import React, { useEffect } from 'react'; 
import { Check } from 'lucide-react'; // Import Check icon

// Client components cannot export 'generateMetadata'.
// Metadata for this page will be set via client-side useEffect for the document title,
// or could fall back to what's defined in a parent layout for static meta tags.

const AboutPage = () => {
  const { language } = useLanguage();
  const t = getTranslations(language);

  // Developer specific information (remains hardcoded as per current structure, can be moved to translations if full multilingual support for this section is needed)
  const developerName = "মোহাম্মদ শেখ শাহিনুর রহমান"; 
  const developerTitles = "সফটওয়্যার ইঞ্জিনিয়ার | প্রোগ্রামার | কবি ও লেখক | ডিজিটাল ফরেনসিক বিশেষজ্ঞ | প্রযুক্তি উদ্ভাবক"; 
  const imageUrl = "https://m.media-amazon.com/images/S/amzn-author-media-prod/b02mvc2hucu96hchlksdjmogii._SY450_CR0%2C0%2C450%2C450_.jpg";
  const developerShortIntro = "মোহাম্মদ শেখ শাহিনুর রহমান একজন বহুমাত্রিক প্রতিভার অধিকারী ব্যক্তিত্ব। তিনি একাধারে একজন সফটওয়্যার ইঞ্জিনিয়ার, প্রোগ্রামার, ডিজিটাল ফরেনসিক বিশেষজ্ঞ এবং প্রযুক্তি উদ্ভাবক। প্রযুক্তির জগতের বাইরেও তিনি একজন স্বনামধন্য কবি ও লেখক। তার লেখনী এবং প্রযুক্তিগত উদ্ভাবন উভয় ক্ষেত্রেই তিনি সমাজের জন্য গুরুত্বপূর্ণ অবদান রেখে চলেছেন।";
  const professionalIdentities = [
    "সফটওয়্যার ইঞ্জিনিয়ার",
    "প্রোগ্রামার",
    "কবি ও লেখক",
    "ডিজিটাল ফরেনসিক বিশেষজ্ঞ",
    "প্রযুক্তি উদ্ভাবক"
  ];
  const personalWebsite = "https://mohammad-sheikh-shahinur-rahman.vercel.app/";
  const blogLink = "https://shahinur.amadersomaj.com/";

  // Update document title dynamically on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = t.aboutPageTitleMeta;
    }
  }, [language, t]);


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto shadow-xl bg-card text-card-foreground rounded-lg">
          <CardHeader className="text-center pt-8 pb-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-36 h-36 mb-6 border-4 border-primary shadow-lg">
                <AvatarImage
                  src={imageUrl}
                  alt={developerName}
                  className="object-cover"
                  data-ai-hint="portrait person"
                />
                <AvatarFallback>{developerName.slice(0,1)}{developerName.split(' ').pop()?.slice(0,1)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl font-headline text-primary mb-1">{developerName}</CardTitle>
              <p className="text-sm text-muted-foreground px-4">{developerTitles}</p>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 px-6 md:px-8">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold font-headline mb-3 text-accent border-b-2 border-accent/30 pb-2">{t.aboutAppTitle}</h2>
              <p className="text-foreground leading-relaxed text-justify">{t.aboutAppDescription}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold font-headline mb-3 text-accent border-b-2 border-accent/30 pb-2">{t.shortIntroTitle}</h2>
              <p className="text-foreground leading-relaxed text-justify">{language === 'bn' ? developerShortIntro : "Mohammad Sheikh Shahinur Rahman is a multifaceted personality. He is a software engineer, programmer, digital forensics expert, and technology innovator. Beyond the world of technology, he is also a renowned poet and writer. He continues to make significant contributions to society through both his writings and technological innovations."}</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold font-headline mb-4 text-accent border-b-2 border-accent/30 pb-2">{t.professionalIdentitiesTitle}</h2>
              <ul className="space-y-2 text-foreground">
                {(language === 'bn' ? professionalIdentities : [
                  "Software Engineer",
                  "Programmer",
                  "Poet & Writer",
                  "Digital Forensics Expert",
                  "Technology Innovator"
                ]).map((identity, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                    {identity}
                  </li>
                ))}
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold font-headline mb-4 text-accent border-b-2 border-accent/30 pb-2">{t.learnMoreTitle}</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="default" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base">
                  <Link href={personalWebsite} target="_blank" rel="noopener noreferrer">
                    {t.personalWebsiteButton}
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-3 text-base">
                  <Link href={blogLink} target="_blank" rel="noopener noreferrer">
                    {t.blogButton}
                  </Link>
                </Button>
              </div>
            </section>
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

export default AboutPage;
