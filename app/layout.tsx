import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reeka',
  description: 'Reeka is a platform for managing your Airbnb listings.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
