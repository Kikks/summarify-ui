import React, { FC } from 'react';
import { Skeleton } from './ui/skeleton';

interface DocumentSkeletonProps {
  className?: string;
}

const DocumentSkeleton: FC<DocumentSkeletonProps> = ({ className }) => {
  return (
    <div
      className={`col-span-1 flex flex-col items-center space-y-2 ${
        className || ''
      }`}
    >
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
};

export default DocumentSkeleton;
