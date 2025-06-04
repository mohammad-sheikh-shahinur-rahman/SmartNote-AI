
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from '@/contexts/LanguageContext';
import { getTranslations, Language } from '@/lib/translations'; // Import getTranslations
import HtmlLangUpdater from '@/components/HtmlLangUpdater'; // Import the new component

// Function to generate dynamic metadata (will pick default 'en' or 'bn')
// For true dynamic metadata based on user preference, a different setup is needed,
// as language context is client-side. This provides a basic server-side default.
export async function generateMetadata({ params }: { params: { lang?: Language } }): Promise<Metadata> {
  // Determine language (e.g., from URL params if set up that way, or default)
  const lang = params?.lang || 'en'; // Default to English if no lang param
  const t = getTranslations(lang as Language); // Cast as Language

  return {
    title: t.appTitle,
    description: t.appTitle, // Could be more specific if needed
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;700&family=PT+Sans:wght@400;700&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
        </head>
        <body className="font-body antialiased">
          <HtmlLangUpdater />
          {children}
          <Toaster />
        </body>
      </html>
    </LanguageProvider>
  );
}
