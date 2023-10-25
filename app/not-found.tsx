import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-10 bg-background">
      <div className="flex h-40 w-40 items-center justify-center rounded-full bg-secondary">
        <XCircle size={52} className="text-secondary-foreground" />
      </div>

      <div className="flex w-full flex-col items-center space-y-2">
        <h1 className="text-4xl font-bold text-secondary-foreground">404</h1>
        <h2 className="text-2xl font-medium text-secondary-foreground">
          Page not found
        </h2>
        <Link href="/" className="!mt-5">
          <Button>Go back home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
