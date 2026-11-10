import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import LayoutContent from '@/src/components/common/LayoutContent';

export const metadata: Metadata = {
  title: 'GROVE ASSETS LTD',
  description: 'Secure digital asset management and investment platform.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedLang = localStorage.getItem('app_selected_lang');
                  if (savedLang) {
                    document.documentElement.setAttribute('data-lang', savedLang);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-950 text-white min-h-screen flex flex-col justify-between antialiased selection:bg-orange-500 selection:text-gray-900">
        <div id="google_translate_element" className="hidden" />

        {/* Client Layout Wrapper for conditional Nav/Footer & Floating Widgets */}
        <LayoutContent>{children}</LayoutContent>

        {/* Google Translate Scripts */}
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
      </body>
    </html>
  );
}