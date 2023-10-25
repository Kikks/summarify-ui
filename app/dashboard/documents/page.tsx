'use client';
import CustomScrollbar from '@/components/custom-scrollbar';
import Document from '@/components/document';
import { PlusIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import IDocument from '@/types/Document.type';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import queryKeys from '@/lib/api/queryKeys';
import { deleteDocument, getDocuments } from '@/services/documents';
import DocumentSkeleton from '@/components/document-skeleton';
import IPageMeta from '@/types/PageMeta.type';
import Pagination from '@/components/ui/pagination';
import CreateDocument from '@/components/create-document';
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
import DocumentList from '@/components/documents-list';

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

const Documents = () => {
  const router = useRouter();
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [documents, setDocuments] = useState<IDocument[] | null>(null);
  const [meta, setMeta] = useState<IPageMeta>({
    currentPage: 1,
    pages: 1,
    total: 0,
  });
  const [itemToBeDeleted, setItemToBeDeleted] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const page = searchParams?.get('page') || '1';

  const { isLoading, data } = useQuery({
    queryKey: [queryKeys.getDocuments, page],
    queryFn: () => getDocuments({ page: parseInt(page), limit: 10 }),
  });

  const { mutate, isPending: deleteIsLoading } = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      setItemToBeDeleted(null);
      setDocuments(
        (prev) => prev?.filter((doc) => doc._id !== itemToBeDeleted) || null,
      );
      toaster.success({
        message: 'Document deleted successfully',
      });
    },
  });

  const selectedItem = documents?.find((doc) => doc._id === itemToBeDeleted);

  const handleSetPage = (page: number) => {
    router.push(`/dashboard/documents?page=${page}`);
  };

  const handleDeleteClicked = (id: string) => {
    setItemToBeDeleted(id);
  };

  const handleDelete = () => {
    if (itemToBeDeleted) mutate(itemToBeDeleted);
  };

  useEffect(() => {
    if (!isLoading && data) {
      setDocuments(data?.data?.documents || []);
      setMeta(data?.data?.meta);
    }
  }, [isLoading, data]);

  return (
    <CustomScrollbar>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid w-full grid-cols-2 gap-5 p-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:p-10 2xl:grid-cols-8"
      >
        {!isLoading && (
          <motion.button
            variants={itemVariants}
            className="col-span-1 flex flex-col items-center space-y-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCreateMenuOpen(true)}
          >
            <div className="flex aspect-square w-full items-center justify-center rounded-lg border-4 border-primary bg-secondary drop-shadow-md">
              <PlusIcon size="42px" />
            </div>

            <span className="text-sm">New Document</span>
          </motion.button>
        )}

        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <DocumentSkeleton key={i} className="cursor-pointer" />
          ))}

        {documents && !isLoading && (
          <DocumentList
            documents={documents}
            handleDeleteClicked={handleDeleteClicked}
          />
        )}
      </motion.div>

      {meta.pages > 1 && (
        <Pagination
          page={meta.currentPage}
          setPage={handleSetPage}
          count={meta.pages}
        />
      )}

      <CreateDocument open={createMenuOpen} setOpen={setCreateMenuOpen} />

      <Dialog
        open={!!itemToBeDeleted}
        onOpenChange={() => (deleteIsLoading ? {} : setItemToBeDeleted(null))}
      >
        <DialogContent className="w-[90%] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete: <br />
              <br />
              <span className="font-semibold italic">
                {selectedItem?.title}
              </span>
              ?
              <br />
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => setItemToBeDeleted(null)}
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
    </CustomScrollbar>
  );
};

export default Documents;
