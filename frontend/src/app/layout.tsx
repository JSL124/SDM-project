import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Online Fundraiser Platform',
  description:
    'Create fundraising campaigns, share stories, and connect with supporters.',
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
