import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import { Toaster } from 'react-hot-toast';
import Providers from '@/providers';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sumarify',
  description: 'Summarize your documents and ask questions about them.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <Providers>
          <head />

          <body
            className={`${poppins.className} flex h-screen w-full overflow-hidden`}
          >
            <NextTopLoader color="#FFF200" crawl showSpinner={false} />
            {children}
            <Toaster
              position="top-right"
              containerClassName="!p-0 bg-transparent"
              toastOptions={{
                style: {
                  background: 'transparent',
                  boxShadow: 'none',
                  padding: '0',
                },
              }}
            />
          </body>
        </Providers>
      </html>
    </>
  );
}
