import type { FC } from 'react';
import ReactPaginate from 'react-paginate';

import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  shortText?: boolean;
  count: number;
}

const Pagination: FC<PaginationProps> = ({ setPage, count, page }) => {
  return (
    <div className="my-4 flex w-full gap-4">
      <div className="flex w-full">
        <ReactPaginate
          breakLabel="..."
          onPageChange={(selectedItem: any) =>
            setPage(selectedItem.selected + 1)
          }
          pageRangeDisplayed={2}
          pageCount={count}
          renderOnZeroPageCount={() => null}
          className="flex w-full items-center justify-center space-x-2 [&li:first-child]:mr-10 [&li:last-child]:ml-10"
          pageLinkClassName="flex h-7 w-7 items-center justify-center rounded-md border border-primary-main text-xs"
          activeLinkClassName="flex h-7 w-7 items-center justify-center bg-accent text-xs text-accent-foreground"
          previousLabel={
            <Button
              size="icon"
              variant="outline"
              disabled={page <= 1}
              className="h-7 w-7"
            >
              <ChevronLeft size={16} />
            </Button>
          }
          nextLabel={
            <Button
              size="icon"
              variant="outline"
              disabled={page >= count}
              className="h-7 w-7"
            >
              <ChevronRight size={16} />
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default Pagination;
