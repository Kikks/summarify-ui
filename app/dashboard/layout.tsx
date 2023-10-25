'use client';
import CustomLoader from '@/components/custom-loader';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login');
    },
  });

  return status === 'loading' ? (
    <div className="flex h-screen w-full items-center justify-center">
      <CustomLoader />
    </div>
  ) : (
    <>
      <Sidebar open={sidebarIsOpen} onClose={() => setSidebarIsOpen(false)} />
      <div className="flex h-full flex-1 flex-col">
        <Navbar toggleSidebar={() => setSidebarIsOpen((prev) => !prev)} />
        {children}
      </div>
    </>
  );
}
