type IConversation = {
  _id: string;
  content: string;
  sender: 'user' | 'ai';
  document: string;
  createdAt?: string;
  updatedAt?: string;
};
