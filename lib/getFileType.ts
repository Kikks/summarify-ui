const getFileType = (fileType?: string) => {
  switch (fileType) {
    case 'application/pdf':
      return 'pdf';
    case 'application/msword':
      return 'docx';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    case 'text/csv':
      return 'csv';
    case 'text/plain':
      return 'txt';
    default:
      return null;
  }
};

export default getFileType;
