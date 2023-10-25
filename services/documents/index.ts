import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from '@/lib/api/calls';
import {
  CreateDocumentConversationPayload,
  CreateDocumentPayload,
  GetDocumentConversationsParams,
  GetDocumentsParams,
} from './payload';

export const getDocuments = (params: GetDocumentsParams) => {
  return getRequest({
    url: '/documents',
    params,
  });
};

export const createDocument = (data: CreateDocumentPayload) => {
  return postRequest({
    url: '/documents',
    data,
  });
};

export const deleteDocument = (id: string) => {
  return deleteRequest({
    url: `/documents/${id}`,
    data: {},
  });
};

export const updateDocument = ({
  id,
  data,
}: {
  id: string;
  data: Partial<CreateDocumentPayload>;
}) => {
  return patchRequest({
    url: `/documents/${id}`,
    data,
  });
};

export const getDocument = (id: string) => {
  return getRequest({
    url: `/documents/${id}`,
    params: {},
  });
};

export const getDocumentConversations = (
  id: string,
  params: GetDocumentConversationsParams,
) => {
  return getRequest({
    url: `/documents/${id}/conversations`,
    params,
  });
};

export const createDocumentConversation = ({
  id,
  data,
}: {
  id: string;
  data: CreateDocumentConversationPayload;
}) => {
  return postRequest({
    url: `/documents/${id}/conversations`,
    data,
  });
};
