'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/src/components/common/Navbar';
import Footer from '@/src/components/common/Footer';
import SupportChat from '@/src/components/common/SupportChat';
import FloatingControls from '@/src/components/common/FloatingControls';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <>
      {!isDashboardRoute && <Navbar />}

      <main className="flex-grow w-full overflow-x-hidden">{children}</main>

      {/* Floating widgets container with proper z-index and spacing */}
      <div className="relative z-[9999]">
        <SupportChat />
        <FloatingControls />
      </div>

      {!isDashboardRoute && <Footer />}
    </>
  );
}