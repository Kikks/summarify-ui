'use client';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Chat from '@/components/chat';
import DocumentDetailsSkeleton from '@/components/document-details-skeleton';
import ChatSkeleton from '@/components/chat-skeleton';
import IDocument from '@/types/Document.type';
import { useMutation, useQuery } from '@tanstack/react-query';
import queryKeys from '@/lib/api/queryKeys';
import {
  deleteDocument,
  generateSummary,
  getDocument,
  getDocumentConversations,
} from '@/services/documents';
import DocumentDetails from '@/components/document-details';
import { AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import toaster from '@/lib/toaster';
import IPageMeta from '@/types/PageMeta.type';
import useMediaQuery from '@/hooks/useMediaQuery';

interface PageProps {
  params: { id: string };
}

const Document: FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const [document, setDocument] = useState<IDocument | null>(null);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [, setMeta] = useState<IPageMeta>({
    currentPage: 1,
    pages: 1,
    total: 0,
  });
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [queryKeys.getDocument, { id: params.id }],
    queryFn: () => getDocument(params.id),
    enabled: !!params.id,
  });

  const {
    data: conversationsData,
    isLoading: conversationsIsLoading,
    isError: conversationsIsError,
  } = useQuery({
    queryKey: [queryKeys.getDocumentConversations, { id: params.id }],
    queryFn: () => getDocumentConversations(params.id, { limit: 50, page: 1 }),
    enabled: !!params.id,
  });

  const { mutate, isPending: deleteIsLoading } = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      setDeleteModalIsOpen(false);
      router.back();
      toaster.success({
        message: 'Document deleted successfully',
      });
    },
  });

  const { mutate: generateSummaryMutate, isPending: generateIsLoading } =
    useMutation({
      mutationFn: generateSummary,
      onSuccess: () => {
        refetch();
        toaster.success({
          message: 'Summary generation in progress',
        });
      },
    });

  const handleDelete = () => {
    mutate(params.id);
  };

  const handleGenerateSummary = () => {
    generateSummaryMutate(params.id);
  };

  useEffect(() => {
    if (data) {
      setDocument(data?.data);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      router.push('/dashboard/documents');
    }
  }, [isError]);

  useEffect(() => {
    if (conversationsIsError) {
      toaster.error({
        message: 'Failed to load conversations',
      });
    }
  }, [conversationsIsError]);

  useEffect(() => {
    if (!conversationsIsLoading && conversationsData) {
      setConversations(conversationsData?.data?.conversations || []);
      setMeta(conversationsData?.data?.meta);
    }
  }, [conversationsIsLoading, data]);

  return (
    <div
      className="relative flex w-full flex-1 bg-gray-300"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${document?.image})`,
      }}
    >
      {isLoading || conversationsIsLoading ? (
        <AnimatePresence>
          <motion.div
            className="flex w-full flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={`loading-${params?.id}`}
          >
            <DocumentDetailsSkeleton />
            {!isSmallScreen && <ChatSkeleton />}
          </motion.div>
        </AnimatePresence>
      ) : document ? (
        <AnimatePresence>
          <motion.div
            className="relative flex w-full flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={`loaded-${params?.id}`}
          >
            <DocumentDetails
              {...document}
              onDeleteClicked={() => setDeleteModalIsOpen(true)}
              onSave={() => refetch()}
              onGenerateSummary={handleGenerateSummary}
              generateIsLoading={generateIsLoading}
            />
            <Chat
              documentId={params.id}
              conversations={conversations}
              setConversations={setConversations}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <></>
      )}

      <Dialog
        open={deleteModalIsOpen}
        onOpenChange={() =>
          deleteIsLoading ? {} : setDeleteModalIsOpen(false)
        }
      >
        <DialogContent className="w-[90%] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete: <br />
              <br />
              <span className="font-semibold italic">{document?.title}</span>
              ?
              <br />
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => setDeleteModalIsOpen(false)}
              variant="outline"
              disabled={deleteIsLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={deleteIsLoading}
              onClick={handleDelete}
            >
              {deleteIsLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Document;
