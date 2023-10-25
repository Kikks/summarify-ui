import { getRequest } from '@/lib/api/calls';

export const getStats = () => {
  return getRequest({
    url: '/stats',
    params: {},
  });
};
