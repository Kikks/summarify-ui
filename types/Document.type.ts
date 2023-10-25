import ISummary from './Summary.type';

type IDocument = {
  _id: string;
  title: string;
  image?: string;
  summary?: ISummary;
  content?: string;
  fileType?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default IDocument;
