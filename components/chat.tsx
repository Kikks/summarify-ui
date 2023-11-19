import { AnimatePresence, motion, useSpring } from 'framer-motion';
import CustomScrollbar from './custom-scrollbar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Loader2,
  MessagesSquare,
  PanelLeftClose,
  PanelRightClose,
  Send,
} from 'lucide-react';
import useToggle from '@/hooks/useToggle';
import { FC, useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDocumentConversation } from '@/services/documents';
import moment from 'moment';
import queryKeys from '@/lib/api/queryKeys';
import Scrollbars from 'react-custom-scrollbars-2';
import useMediaQuery from '@/hooks/useMediaQuery';

interface IChatProps {
  documentId: string;
  conversations: IConversation[];
  setConversations: (conversations: IConversation[]) => void;
}

const Chat: FC<IChatProps> = ({
  conversations = [],
  setConversations,
  documentId,
}) => {
  const ref = useRef<Scrollbars>(null);
  const [sortedConversations, setSortedConversations] = useState<
    IConversation[]
  >([]);
  const [collapsed, toggleCollapse, setCollapse] = useToggle(false);
  const width = useSpring(300, { stiffness: 300, damping: 40 });
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const isSmallScreen = useMediaQuery('(max-width: 1023px)');

  const { mutate, isPending } = useMutation({
    mutationFn: createDocumentConversation,
    onSuccess: (response) => {
      const newConversations = [...conversations];
      newConversations.pop();
      setConversations([...newConversations, ...(response?.data || [])]);
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getDocumentConversations, { id: documentId }],
      });
    },
  });

  const handleSubmission = async () => {
    if (message.length === 0) return;

    setMessage('');

    setConversations([
      ...conversations,
      {
        _id: Date.now().toString(),
        content: message,
        createdAt: new Date().toISOString(),
        sender: 'user',
        document: documentId,
      },
    ]);

    mutate({
      id: documentId,
      data: { content: message },
    });
  };

  useEffect(() => {
    if (isSmallScreen) {
      setCollapse(true);
    }
  }, [isSmallScreen]);

  useEffect(() => {
    if (collapsed) {
      width.set(0);
    } else {
      width.set(300);
    }
  }, [collapsed]);

  useEffect(() => {
    setSortedConversations(
      [...conversations].sort(
        (a, b) =>
          new Date(a?.createdAt || '').getTime() -
          new Date(b?.createdAt || '').getTime(),
      ),
    );

    setTimeout(() => {
      if (ref?.current) {
        ref.current?.scrollToBottom();
      }
    }, 100);
  }, [conversations]);

  return (
    <>
      <AnimatePresence>
        {isSmallScreen && !collapsed && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCollapse(true)}
            aria-hidden={collapsed}
            className="fixed inset-0 z-10 bg-black bg-opacity-70"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 40 }}
        style={{ width }}
        className="fixed right-0 top-0 z-10 h-full w-[300px] bg-background shadow-lg lg:static"
      >
        <div className="relative flex h-full w-full flex-col">
          <Button
            size="icon"
            variant="outline"
            onClick={toggleCollapse}
            className="absolute -left-8 top-20 h-8 w-8 xl:top-1"
          >
            {collapsed ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelRightClose size={20} />
            )}
          </Button>

          <CustomScrollbar ref={ref} autoHide className="w-full flex-1 p-3">
            {sortedConversations.length === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center space-y-5 text-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-secondary">
                  <MessagesSquare size={40} />
                </div>

                <span className="text-xs text-secondary-foreground">
                  No conversations yet. <br /> Ask a question about your
                  document!
                </span>
              </div>
            ) : (
              <div className="flex w-full flex-col space-y-5 p-3">
                {sortedConversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    className={`flex w-full ${
                      conversation.sender === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex w-full flex-col space-y-1 ${
                        conversation.sender === 'user'
                          ? 'items-end'
                          : 'items-start'
                      }`}
                    >
                      <div
                        className={`flex max-w-[90%] flex-col space-y-5 rounded-lg p-2 ${
                          conversation.sender === 'user'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {(conversation?.content || '')
                          .split('\n')
                          .map((line, index) => (
                            <p key={index} className="text-xs">
                              {line}
                            </p>
                          ))}
                      </div>

                      <span className="text-[9px]">
                        {moment(conversation?.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isPending && (
              <div className="flex w-full flex-col space-y-5 p-3">
                <div className="flex w-full justify-start">
                  <div className="flex w-full flex-col items-start space-y-1">
                    <div className="flex max-w-[90%] flex-col space-y-5 rounded-lg bg-secondary p-2 text-secondary-foreground">
                      <motion.div className="flex items-center space-x-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="h-2 w-2 rounded-full bg-accent"
                            animate={{
                              scale: [0.5, 1, 0.5],
                              transition: {
                                repeat: Infinity,
                                delay: i * 0.2,
                              },
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CustomScrollbar>

          <div className="flex w-full items-center space-x-2 bg-secondary p-3">
            <Input
              placeholder="Ask a question..."
              className="flex-1 text-xs"
              value={message}
              disabled={isPending}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmission();
                }
              }}
            />
            <Button
              disabled={isPending || message?.trim() === ''}
              variant="default"
              size="icon"
              onClick={handleSubmission}
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Chat;
