import {
  QueryCache,
  QueryClient,
  type QueryClientConfig,
} from '@tanstack/react-query';
import toaster from '../toaster';

export const queryClientConfig: QueryClientConfig = {
  queryCache: new QueryCache({
    onError: (error: any) =>
      toaster.error({
        message:
          error?.response?.data?.message ||
          'Something went wrong, try again later.',
      }),
  }),

  defaultOptions: {
    mutations: {
      onError: (error: any) => {
        toaster.error({
          message:
            error?.response?.data?.message ||
            'Something went wrong, try again later.',
        });
      },
    },
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);
