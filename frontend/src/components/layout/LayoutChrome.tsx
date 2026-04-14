'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import AdminNavbar from './AdminNavbar';
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
        <Suspense fallback={null}>
          <AdminNavbar />
        </Suspense>
        {children}
      </>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
