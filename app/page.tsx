'use client';

import CustomLoader from '@/components/custom-loader';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const session = useSession();

  if (session.status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  if (session.status === 'authenticated') {
    router.replace('/dashboard');
  }

  if (session.status === 'unauthenticated') {
    router.replace('/auth/login');
  }

  return <></>;
}
