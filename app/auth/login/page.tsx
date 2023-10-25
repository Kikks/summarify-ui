'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import toaster from '@/lib/toaster';
import { useRouter } from 'next/navigation';

const containerVariant = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariant = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayload((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await signIn('credentials', {
        redirect: false,
        callbackUrl: '/dashboard',
        username: payload.email,
        password: payload.password,
      });

      if (response?.error) {
        toaster.error({ message: 'Invalid credentials.' });
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      toaster.error({
        message: 'Something went wrong, please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-full w-full flex-col items-center justify-center space-y-3 bg-secondary p-5">
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="mx-auto flex w-full max-w-[500px] flex-col items-center space-y-12 rounded-2xl border-2 bg-background p-5 lg:p-10"
      >
        <motion.figure
          variants={itemVariant}
          className="flex items-center space-x-3"
        >
          <Image
            src="/logo.svg"
            alt="Summarify Logo"
            width={28}
            height={28}
            priority
          />

          <h1 className="font-bold">Summarify</h1>
        </motion.figure>

        <motion.div
          variants={itemVariant}
          className="flex w-full flex-col space-y-2"
        >
          <h1 className="text-xl lg:text-3xl">Log In</h1>
          <span className="text-sm text-secondary-foreground">
            Please sign in to continue 😎
          </span>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          variants={itemVariant}
          className="flex w-full flex-col space-y-3"
        >
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your email"
              required
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="default"
            className="!mt-5 w-full"
            disabled={loading}
          >
            {loading ? 'Loggin in...' : 'Log In'}
          </Button>
        </motion.form>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1 } }}
        className="text-center text-sm"
      >
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-accent">
          Sign up
        </Link>
      </motion.p>
    </main>
  );
};

export default Login;
