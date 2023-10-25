import Image from 'next/image';
import React, { FC } from 'react';
import { Button } from './ui/button';
import { MenuIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useSession } from 'next-auth/react';
import getInitials from '@/lib/getInitials';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: FC<NavbarProps> = ({ toggleSidebar }) => {
  const session = useSession();

  return (
    <nav className="flex w-full items-center justify-between bg-background px-5">
      <div className="flex w-full items-center justify-between border-b py-5 lg:px-5">
        <figure className="flex items-center space-x-3">
          <Image
            src="/logo.svg"
            alt="Summarify Logo"
            width={32}
            height={32}
            priority
          />

          <h1 className="text-lg font-bold">Summarify</h1>
        </figure>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback>
                {getInitials(
                  `${session?.data?.user?.firstName} ${session?.data?.user?.lastName}`,
                )}
              </AvatarFallback>
            </Avatar>

            <span className="hidden text-sm font-medium lg:inline">
              {session?.data?.user?.firstName} {session?.data?.user?.lastName}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
