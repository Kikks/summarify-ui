'use client';
import IDocument from '@/types/Document.type';
import { FC } from 'react';
import Document from './document';
import { useRouter } from 'next/navigation';

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

interface DocumentListProps {
  documents: IDocument[];
  handleDeleteClicked: (id: string) => void;
}

const DocumentList: FC<DocumentListProps> = ({
  documents,
  handleDeleteClicked,
}) => {
  const router = useRouter();

  return documents.map((document, index) => (
    <Document
      {...document}
      key={`${document._id}-${index}`}
      className="cursor-pointer"
      onClick={() => router.push(`/dashboard/documents/${document._id}`)}
      onDelete={handleDeleteClicked}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      variants={itemVariants}
    />
  ));
};

export default DocumentList;
