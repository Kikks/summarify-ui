'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import toaster from '@/lib/toaster';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/services/user';
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

const Signup = () => {
  const router = useRouter();
  const [payload, setPayload] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toaster.success({
        message: 'Account created successfully',
      });
      router.push('/auth/login');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayload((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      payload.email.trim() === '' ||
      payload.password.trim() === '' ||
      payload.firstName.trim() === '' ||
      payload.lastName.trim() === ''
    ) {
      toaster.error({
        message: 'Please fill all the fields',
      });
      return;
    }

    const emailRegex = new RegExp(
      // eslint-disable-next-line no-control-regex
      '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
    );

    if (!emailRegex.test(payload.email)) {
      toaster.error({
        message: 'Please enter a valid email address',
      });
      return;
    }

    mutate(payload);
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
          <h1 className="text-xl lg:text-3xl">Sign up</h1>
          <span className="text-sm text-secondary-foreground">
            Create your free account 😎
          </span>
        </motion.div>

        <motion.form
          variants={itemVariant}
          className="flex w-full flex-col space-y-3"
          onSubmit={handleSumbit}
        >
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">First Name</Label>
            <Input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              required
              value={payload.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Last Name</Label>
            <Input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              required
              value={payload.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={payload.email}
              onChange={handleChange}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your email"
              required
              value={payload.password}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            variant="default"
            className="!mt-5 w-full"
            disabled={isPending}
          >
            {isPending ? 'Creating account...' : 'Create account'}
          </Button>
        </motion.form>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1 } }}
        className="text-center text-sm"
      >
        Already have an account?{' '}
        <Link href="/auth/login" className="text-accent">
          Log In
        </Link>
      </motion.p>
    </main>
  );
};

export default Signup;
