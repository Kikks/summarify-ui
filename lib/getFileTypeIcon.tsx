import { Icon } from '@iconify/react/dist/iconify.js';

const getFileTypeIcon = (
  fileType: string = '',
  options?: {
    className?: string;
  },
) => {
  const { className } = options || { className: '' };

  switch (fileType) {
    case 'pdf':
      return (
        <Icon
          icon="ph:file-pdf-duotone"
          className={`text-2xl text-gray-500 ${className || ''}`}
        />
      );
    case 'docx':
      return (
        <Icon
          icon="ph:file-doc-duotone"
          className={`text-2xl text-gray-500 ${className || ''}`}
        />
      );
    case 'csv':
      return (
        <Icon
          icon="ph:file-csv-duotone"
          className={`text-2xl text-gray-500 ${className || ''}`}
        />
      );
    case 'txt':
      return (
        <Icon
          icon="tabler:file-type-txt"
          className={`text-2xl text-gray-500 ${className || ''}`}
        />
      );
    default:
      return (
        <Icon
          icon="ph:note-fill"
          className={`text-2xl text-gray-500 ${className || ''}`}
        />
      );
  }
};

export default getFileTypeIcon;
