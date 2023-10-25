import React, { FC } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ChevronLeft, FilePlus, MonitorUp } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import toaster from '@/lib/toaster';
import axios from 'axios';
import { daURL, supportedFileTypes } from '@/lib/constants';
import { useMutation } from '@tanstack/react-query';
import { createDocument } from '@/services/documents';
import getFileType from '@/lib/getFileType';
import { useRouter } from 'next/navigation';
import { Textarea } from './ui/textarea';

interface CreateDocumentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const options = [
  {
    key: 'upload',
    title: 'Upload from device',
    subtitle: 'Select a document to summarize',
    icon: <MonitorUp size={48} />,
  },
  {
    key: 'create',
    title: 'Create new document',
    subtitle: 'Create a new document from scratch',
    icon: <FilePlus size={48} />,
  },
];

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
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

const CreateDocument: FC<CreateDocumentProps> = ({ open, setOpen }) => {
  const router = useRouter();
  const [file, setFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [fileUploading, setFileUploading] = React.useState<boolean>(false);

  const [createIsLoading, setCreateIsLoading] = React.useState<boolean>(false);
  const [documentDetails, setDocumentDetails] = React.useState({
    title: '',
    content: '',
  });

  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );
  const optionDetails = options.find((option) => option.key === selectedOption);

  const { mutate, isPending } = useMutation({
    mutationFn: createDocument,
    onSuccess: (data) => {
      if (data?.data?._id) {
        router.push(`/dashboard/documents/${data?.data?._id}`);
      }
    },
  });

  const handleClose = () => {
    if (fileUploading) return;
    if (createIsLoading) return;
    if (isPending) return;

    setOpen(false);
    setSelectedOption(null);
    setFile(null);
    setFileError(null);
    setFileUploading(false);
    setCreateIsLoading(false);
    setDocumentDetails({
      title: '',
      content: '',
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setDocumentDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is supported
    if (!supportedFileTypes.includes(file.type)) {
      toaster.error({ message: 'Invalid file type.' });
      setFileError('Invalid file type.');
      return;
    }

    // Check if file size is less than 5MB
    if (file.size > 5 * 1024 * 1024) {
      toaster.error({ message: 'File size must be less than 5MB.' });
      setFileError('File size must be less than 5MB.');
      return;
    }

    setFile(file);
  };

  const handleFileUpload = async () => {
    try {
      setFileUploading(true);
      const formData = new FormData();
      formData.append('file', file as File);

      const response = await axios.post(`${daURL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if ((response?.data?.text || '').trim() === '') {
        toaster.error({
          message: 'The text from your document could not be extracted.',
        });
        return;
      }

      mutate({
        title: file?.name || 'Untitled Document',
        content: response?.data?.text,
        ...(getFileType(file?.type) !== null
          ? {
              fileType: getFileType(file?.type) as string,
            }
          : {}),
      });
    } catch (error) {
      console.log(error);
      toaster.error({ message: 'Something went wrong. Try again later.' });
    } finally {
      setFileUploading(false);
    }
  };

  const handleCreateDocument = async () => {
    if (
      documentDetails.title.trim() === '' ||
      documentDetails.content.trim() === ''
    ) {
      toaster.error({ message: 'Please fill out all fields.' });
      return;
    }

    try {
      setCreateIsLoading(true);
      mutate({
        title: documentDetails.title,
        content: documentDetails.content,
      });
    } catch (error) {
      console.log(error);
      toaster.error({ message: 'Something went wrong. Try again later.' });
    } finally {
      setCreateIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`w-[90%] ${
          selectedOption === 'create' ? 'sm:max-w-[700px]' : 'sm:max-w-[425px]'
        }`}
      >
        <DialogHeader>
          <DialogTitle className="!text-left">
            {selectedOption && (
              <Button
                onClick={() => setSelectedOption(null)}
                variant="outline"
                size="icon"
                className="mr-3 h-7 w-7"
              >
                <ChevronLeft size={16} />
              </Button>
            )}
            {optionDetails?.title || 'Create Document'}
          </DialogTitle>
          <DialogDescription className="!text-left">
            {optionDetails?.subtitle ||
              'Select an option below to create a new document'}
          </DialogDescription>
        </DialogHeader>

        {selectedOption === null && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-10 flex items-center justify-center space-x-5"
          >
            {options.map((option) => (
              <motion.button
                key={option.key}
                variants={itemVariants}
                className="flex aspect-square w-1/2 flex-col items-center justify-center space-y-5 rounded-xl border p-3 text-center"
                onClick={() => setSelectedOption(option.key)}
              >
                {option.icon}
                <span className="text-xs">{option.title}</span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {selectedOption === 'upload' && (
          <>
            <div className="mt-10 grid w-full items-center gap-1.5">
              <Label htmlFor="document">Select Document (max 5mb)</Label>
              <Input
                id="document"
                type="file"
                accept=".pdf,.doc,.docx,.csv,.txt"
                onChange={handleFileChange}
                disabled={fileUploading}
              />
              <Label
                className={`text-xs text-muted-foreground/50 ${
                  fileError ? 'text-destructive' : ''
                }`}
                htmlFor="document"
              >
                {fileError || 'Supported file types: pdf, doc, docx, csv, txt'}
              </Label>
            </div>

            <DialogFooter>
              <Button
                disabled={!file || fileUploading || isPending}
                type="submit"
                onClick={handleFileUpload}
              >
                {fileUploading || isPending
                  ? 'Uploading...'
                  : 'Upload Document'}
              </Button>
            </DialogFooter>
          </>
        )}

        {selectedOption === 'create' && (
          <>
            <div className="mt-5 flex w-full flex-col items-center justify-center space-y-5">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  onChange={handleInputChange}
                  placeholder="Enter your document title"
                  disabled={createIsLoading || isPending}
                />
              </div>

              <div className="mt-10 grid w-full items-center gap-1.5">
                <Label htmlFor="title">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  onChange={handleInputChange}
                  placeholder="Enter your document content"
                  rows={15}
                  disabled={createIsLoading || isPending}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={
                  documentDetails.title.trim() === '' ||
                  documentDetails.content.trim() === '' ||
                  createIsLoading ||
                  isPending
                }
                type="submit"
                onClick={handleCreateDocument}
              >
                {fileUploading || isPending ? 'Creating...' : 'Create Document'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateDocument;
