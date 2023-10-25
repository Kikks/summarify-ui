import { motion, HTMLMotionProps } from 'framer-motion';

import IDocument from '@/types/Document.type';
import { FC } from 'react';
import moment from 'moment';
import getFileTypeIcon from '@/lib/getFileTypeIcon';
import trimText from '@/lib/trimText';
import { Trash2 } from 'lucide-react';

type MotionAndDocumentProps = IDocument & HTMLMotionProps<'div'>;

interface DocumentProps extends MotionAndDocumentProps {
  disableDelete?: boolean;
  onDelete?: (id: string) => void;
}

const Document: FC<DocumentProps> = ({
  title,
  createdAt,
  image,
  summary,
  fileType,
  className,
  onClick,
  onDelete,
  disableDelete,
  _id,
  ...rest
}) => {
  return (
    <motion.div
      className={`group col-span-1 flex flex-col items-center space-y-2 ${
        className || ''
      }`}
      {...rest}
    >
      <figure className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-4 border-primary bg-secondary shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            image ||
            'https://generative-placeholders.glitch.me/image?width=300&height=300&style=circles'
          }
          alt={title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 h-full w-full" onClick={onClick} />

        <button className="absolute bottom-0 right-0 flex h-8 w-16 items-center justify-center overflow-hidden rounded-tl-lg border-4 border-white bg-white lg:w-8">
          <div
            className={`flex w-full items-center justify-center duration-300
            ${
              disableDelete
                ? ''
                : 'lg:translate-x-[10px] group-hover:lg:translate-x-[-100px]'
            }
          `}
          >
            {getFileTypeIcon(fileType)}
          </div>

          <button
            disabled={disableDelete}
            onClick={() => {
              if (onDelete) onDelete(_id);
            }}
            className={`flex w-full items-center justify-center duration-300 lg:translate-x-[100px] group-hover:lg:translate-x-[-12px] ${
              disableDelete ? 'hidden' : ''
            }`}
          >
            <Trash2 size="18px" className="text-destructive" />
          </button>
        </button>
      </figure>

      <div className="flex flex-col items-center">
        <span className="text-center text-sm font-medium">
          {trimText(title, 20)}
        </span>
        <span className="text-center text-xs text-gray-500">
          {moment(createdAt).fromNow()}
        </span>
      </div>
    </motion.div>
  );
};

export default Document;
