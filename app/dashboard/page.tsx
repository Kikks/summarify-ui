'use client';
import { motion } from 'framer-motion';
import CustomScrollbar from '@/components/custom-scrollbar';
import Document from '@/components/document';
import DocumentSkeleton from '@/components/document-skeleton';
import StatCard from '@/components/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import queryKeys from '@/lib/api/queryKeys';
import toaster from '@/lib/toaster';
import { getDocuments } from '@/services/documents';
import { getStats } from '@/services/stats';
import IDocument from '@/types/Document.type';
import { useQuery } from '@tanstack/react-query';
import { FileText, HelpCircle, ScrollText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const Home = () => {
  const { data } = useSession();
  const router = useRouter();
  const [recentDocuments, setRecentDocuments] = useState<IDocument[] | null>(
    null,
  );
  const [stats, setStats] = useState({
    documents: 0,
    summaries: 0,
    questionsAnswered: 0,
  });

  const {
    isLoading,
    data: statsData,
    isError,
  } = useQuery({
    queryKey: [queryKeys.getStats],
    queryFn: getStats,
  });

  const {
    isLoading: recentDocumentsIsLoading,
    data: recentDocumentsData,
    isError: recentDocumentsIsError,
  } = useQuery({
    queryKey: [queryKeys.getRecentDocuments],
    queryFn: () =>
      getDocuments({
        limit: 3,
        page: 1,
        sortBy: 'createdAt',
        orderBy: 'desc',
      }),
  });

  const greetUser = () => {
    if (data) {
      const hour = new Date().getHours();
      if (hour < 12) {
        return 'Good Morning 🌤';
      } else if (hour < 18) {
        return 'Good Afternoon ☀️';
      } else {
        return 'Good Evening 🌑';
      }
    }
    return 'Welcome';
  };

  useEffect(() => {
    if (!isLoading && statsData) {
      setStats(
        statsData?.data || {
          documents: 0,
          summaries: 0,
          questionsAnswered: 0,
        },
      );
    }
  }, [statsData, isLoading]);

  useEffect(() => {
    if (!recentDocumentsIsLoading && recentDocumentsData) {
      setRecentDocuments(recentDocumentsData?.data?.documents || []);
    }
  }, [recentDocumentsData, recentDocumentsIsLoading]);

  useEffect(() => {
    if (isError) {
      toaster.error({
        message: 'Failed to fetch stats',
      });
    }
  }, [isError]);

  useEffect(() => {
    if (recentDocumentsIsError) {
      toaster.error({
        message: 'Failed to fetch recent documents',
      });
    }
  }, [recentDocumentsIsError]);

  return (
    <CustomScrollbar className="w-full flex-1">
      <main className="flex-col space-y-10 p-5 xl:p-10">
        <p>
          {greetUser()},{' '}
          <strong>
            {data?.user?.firstName || '_'} {data?.user?.lastName || ''}.
          </strong>{' '}
          Welcome to your dashboard.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <Skeleton
                className="aspect-video w-full rounded-lg"
                key={index}
              />
            ))
          ) : (
            <>
              <StatCard
                title="Documents"
                value={stats.documents}
                Icon={FileText}
                variants={itemVariants}
              />
              <StatCard
                title="Summaries Generated"
                value={stats.summaries}
                Icon={ScrollText}
                variants={itemVariants}
              />
              <StatCard
                title="Questions Answered"
                value={stats.questionsAnswered}
                Icon={HelpCircle}
                variants={itemVariants}
              />
            </>
          )}
        </motion.div>

        <div className="flex w-full flex-col space-y-5">
          <h3 className="text-xl font-medium">Recent Documents</h3>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8"
          >
            {recentDocumentsIsLoading
              ? [...Array(3)].map((_, index) => (
                  <DocumentSkeleton key={index} />
                ))
              : recentDocuments &&
                recentDocuments?.map((document) => (
                  <Document
                    key={document._id}
                    {...document}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/documents/${document._id}`)
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variants={itemVariants}
                    disableDelete
                  />
                ))}
          </motion.div>
        </div>
      </main>
    </CustomScrollbar>
  );
};

export default Home;
