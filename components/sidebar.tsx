'use client';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';
import { FC, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import useMediaQuery from '@/hooks/useMediaQuery';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';

const links = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: 'solar:home-2-linear',
  },
  {
    name: 'Docs',
    href: '/dashboard/documents',
    icon: 'solar:document-linear',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: 'solar:settings-linear',
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ open, onClose }) => {
  const x = useSpring(0, {
    stiffness: 300,
    damping: 40,
  });
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isSmallScreen = useMediaQuery('(max-width: 1023px)');

  const getPathClass = (href: string) => {
    const activeClass = 'bg-primary text-primary-foreground';
    const inactiveClass =
      'group-hover:bg-gray-700 group-hover:text-primary-foreground group-hover:dark:text-primary';

    if (href === '/dashboard') {
      return pathname === '/dashboard' ? activeClass : inactiveClass;
    }

    return pathname?.startsWith(href) ? activeClass : inactiveClass;
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/auth/login' });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSmallScreen) {
      if (open) {
        x.set(0);
      } else {
        x.set(-100);
      }
    }
  }, [open, isSmallScreen, x]);

  return (
    <>
      <AnimatePresence>
        {isSmallScreen && open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden={!open}
            className="fixed inset-0 z-[100] bg-black bg-opacity-70"
          />
        )}
      </AnimatePresence>

      <motion.aside
        key="sidebar"
        style={{
          x: isSmallScreen ? x : 0,
        }}
        className={`fixed left-0 top-0 z-[200] flex h-full w-20 flex-col space-y-5 bg-secondary py-5 lg:static`}
      >
        {links.map(({ name, href, icon }, index) => (
          <Link
            key={index}
            href={href}
            onClick={onClose}
            className="group flex w-full flex-col items-center justify-center space-y-1"
          >
            <div
              className={`flex w-[80%] items-center justify-center rounded-full px-3 py-2 duration-200 ${getPathClass(
                href,
              )}`}
            >
              <Icon icon={icon} className="text-2xl" />
            </div>
            <span className="text-xs font-medium text-secondary-foreground">
              {name}
            </span>
          </Link>
        ))}

        <button
          className="group !mt-auto flex w-full cursor-pointer flex-col items-center justify-center space-y-1"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <div className=" flex w-[80%] items-center justify-center rounded-full px-3 py-2 duration-200 group-hover:bg-gray-700 group-hover:text-primary-foreground group-hover:dark:text-primary">
            <Icon
              icon={
                theme === 'dark'
                  ? 'solar:sun-bold-duotone'
                  : 'solar:moon-stars-bold-duotone'
              }
              className="text-2xl"
            />
          </div>
          <span className="text-xs font-medium text-secondary-foreground">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        <button
          className="group flex w-full cursor-pointer flex-col items-center justify-center space-y-1"
          onClick={handleLogout}
        >
          <div className=" flex w-[80%] items-center justify-center rounded-full px-3 py-2 duration-200 group-hover:bg-red-500/20">
            <Icon
              icon="solar:logout-linear"
              className="text-2xl !text-red-500"
            />
          </div>
          <span className="text-xs font-medium !text-red-500">Logout</span>
        </button>
      </motion.aside>
    </>
  );
};

export default Sidebar;
