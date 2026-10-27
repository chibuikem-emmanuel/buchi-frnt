// src/app/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/src/components/common/Navbar';
import Footer from '@/src/components/common/Footer';
import SupportChat from '@/src/components/common/SupportChat';
import FloatingControls from '@/src/components/common/FloatingControls';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if current route is part of user or admin dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gray-950 text-white min-h-screen flex flex-col justify-between antialiased">
        <div id="google_translate_element" className="hidden" />

        {/* Render global Navbar only on public pages */}
        {!isDashboardRoute && <Navbar />}

        <main className="flex-grow">{children}</main>

        <SupportChat />
        <FloatingControls />

        {/* Render global Footer only on public pages */}
        {!isDashboardRoute && <Footer />}

        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  { pageLanguage: 'en', autoDisplay: false },
                  'google_translate_element'
                );
              }
            `,
          }}
        />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />



        <script dangerouslySetInnerHTML={{ __html: `
  (function() {
    try {
      var savedLang = localStorage.getItem('app_selected_lang');
      if (savedLang) {
        // Store in cookies if Google Translate reads cookies, or prep state
        document.documentElement.setAttribute('data-lang', savedLang);
      }
    } catch (e) {}
  })();
`}} />
      </body>
    </html>
  );
}