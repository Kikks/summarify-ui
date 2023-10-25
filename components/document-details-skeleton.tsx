import React from 'react';
import { Skeleton } from './ui/skeleton';
import CustomScrollbar from './custom-scrollbar';

const DocumentDetailsSkeleton = () => {
  return (
    <CustomScrollbar className="h-full flex-1" autoHide>
      <div className="h-full flex-1">
        <div className="mx-auto flex min-h-full max-w-[1000px] flex-col p-5 xl:p-10">
          <div className="min-h-full w-full flex-1 space-y-10 rounded-2xl bg-background p-5">
            <div className="flex w-full items-center space-x-5 border-b pb-5">
              <div className="flex flex-1 items-center space-x-5">
                <Skeleton className="flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary" />

                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-7 w-40 sm:w-52 md:w-72" />
                  <div className="flex items-center space-x-5">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
              </div>

              <Skeleton className="h-10 w-10" />
            </div>

            <div className="w-full space-y-10">
              <Skeleton className="h-14 w-full max-w-[400px]" />

              <div className="flex flex-col items-center space-y-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex w-full flex-col space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomScrollbar>
  );
};

export default DocumentDetailsSkeleton;
