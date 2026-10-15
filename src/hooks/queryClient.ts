/** Centralizes server-state caching and the narrowly-scoped retry policy. */
import { QueryClient } from '@tanstack/react-query';
import { AppError } from '../api/client';
import { QUERY_STALE_TIME_MS } from '../utils/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      refetchOnReconnect: true,
      // Only retry transient failures; repeating auth, missing-data, or rate-limit errors won't help.
      retry: (failureCount, error) => {
        const retryableKinds: AppError['kind'][] = ['network', 'server', 'timeout'];
        return error instanceof AppError && retryableKinds.includes(error.kind)
          ? failureCount < 2
          : false;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
