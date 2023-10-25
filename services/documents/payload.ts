export type GetDocumentsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  orderBy?: string;
};

export type CreateDocumentPayload = {
  title: string;
  content: string;
  fileType?: string;
};

export type GetDocumentConversationsParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: string;
};

export type CreateDocumentConversationPayload = {
  content: string;
};
