'use client';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './auth';
import { queryClient } from '@/lib/config/queryClient.config';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Providers: FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={true}
        disableTransitionOnChange={false}
      >
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
