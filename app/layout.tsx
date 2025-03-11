// 'use client';

import './globals.css';

import { Bounce, ToastContainer } from 'react-toastify';

import AuthProvider from '@/components/providers/session-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reeka',
  description: 'Reeka is a platform for managing your Airbnb listings.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </body>
    </html>
  );
}
