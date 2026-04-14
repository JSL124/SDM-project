'use client';

import { usePathname } from 'next/navigation';
import AdminNavbar from './AdminNavbar';
import Footer from './Footer';
import Navbar from './Navbar';

interface LayoutChromeProps {
  children: React.ReactNode;
}

export default function LayoutChrome({ children }: LayoutChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  if (isAdminRoute) {
    return (
      <>
        <AdminNavbar />
        {children}
      </>
    );
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
