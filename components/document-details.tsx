import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import CustomScrollbar from '@/components/custom-scrollbar';
import IDocument from '@/types/Document.type';
import getFileTypeIcon from '@/lib/getFileTypeIcon';
import { Button } from './ui/button';
import {
  Calendar,
  Check,
  Edit,
  Loader2,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import moment from 'moment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import AnimatedParagraph from './animated-paragraph';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import { updateDocument } from '@/services/documents';

interface DocumentDetailsProps extends IDocument {
  onDeleteClicked?: () => void;
  onSave?: (update: Partial<IDocument>) => void;
}

const DocumentDetails: FC<DocumentDetailsProps> = ({
  _id,
  title,
  content,
  summary,
  fileType,
  createdAt,
  onDeleteClicked,
  onSave,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      setIsEditing(false);
      if (onSave)
        onSave({
          title: newTitle,
        });
    },
  });

  const handleSave = () => {
    if (newTitle === title) {
      setIsEditing(false);
      return;
    }

    if (newTitle.trim().length === 0) return;

    mutate({
      id: _id,
      data: {
        title: newTitle,
      },
    });
  };

  return (
    <CustomScrollbar className="h-full flex-1" autoHide>
      <div className="mx-auto flex min-h-full max-w-[1000px] flex-col p-3 md:p-5 xl:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.5,
              when: 'beforeChildren',
              staggerChildren: 0.1,
            },
          }}
          className="min-h-full w-full flex-1 space-y-10 rounded-2xl bg-background p-5"
        >
          <div className="flex w-full items-start space-x-2 border-b pb-5 md:space-x-5">
            <div className="flex flex-1 items-start space-x-2 md:space-x-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-secondary md:h-14 md:w-14 lg:h-16 lg:w-16">
                {getFileTypeIcon(fileType, {
                  className:
                    'text-2xl md:text-3xl lg:text-4xl text-secondary-foreground',
                })}
              </div>

              <div className="flex flex-1 flex-col space-y-2">
                {isEditing ? (
                  <TextareaAutosize
                    cacheMeasurements
                    value={newTitle}
                    disabled={isPending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSave();
                      }
                    }}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-xl font-medium ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-2xl lg:text-3xl"
                  />
                ) : (
                  <h1 className="flex-1 text-xl font-medium md:text-2xl lg:text-3xl">
                    {title}
                  </h1>
                )}

                <div className="flex items-center space-x-5">
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} />
                    <span className="text-xs text-gray-500">
                      {moment(createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {isEditing ? (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSave}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Check />
                )}
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:!bg-destructive/30"
                      onClick={() => {
                        if (onDeleteClicked) onDeleteClicked();
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      <span className="text-destructive">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Tabs defaultValue="summary" className="w-full space-y-10">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="full-text">Full Text</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <AnimatedParagraph
                paragraphs={(summary?.content || '').split('\n')}
              />
            </TabsContent>
            <TabsContent value="full-text">
              <AnimatedParagraph paragraphs={(content || '').split('\n')} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </CustomScrollbar>
  );
};

export default DocumentDetails;
