import React from 'react';
import CustomScrollbar from './custom-scrollbar';
import { Skeleton } from './ui/skeleton';

const ChatSkeleton = () => {
  return (
    <div className="z-10 flex h-full w-[300px] flex-col bg-background shadow-lg">
      <CustomScrollbar autoHide className="w-full flex-1 p-3">
        <div className="flex h-full min-h-screen w-full flex-col space-y-10 p-3">
          <div className="flex w-full flex-col space-y-2 self-start">
            <Skeleton className="h-10 w-3/5" />
            <Skeleton className="h-8 w-3/5" />
            <Skeleton className="h-20 w-3/5" />
          </div>

          <div className="flex w-full flex-col items-end space-y-2 self-end">
            <Skeleton className="h-14 w-4/5" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>

          <div className="flex w-full flex-col space-y-2 self-start">
            <Skeleton className="h-10 w-3/5" />
            <Skeleton className="h-5 w-2/5" />
          </div>

          <div className="flex w-full flex-col items-end space-y-2 self-end">
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-10 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>

          <div className="flex w-full flex-col space-y-2 self-start">
            <Skeleton className="h-16 w-3/5" />
            <Skeleton className="h-7 w-2/5" />
          </div>
        </div>
      </CustomScrollbar>

      <div className="bg- flex w-full items-center space-x-2 p-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
};

export default ChatSkeleton;
