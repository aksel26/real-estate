'use client';

import { useIsFetching } from '@tanstack/react-query';

type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

interface LoadingState {
  isAnyLoading: boolean;
  loadingCount: number;
  status: LoadingStatus;
  hasError: boolean;
}

/**
 * Aggregates global loading states from TanStack Query.
 * Uses useIsFetching to count active fetches across all queries.
 */
export function useLoadingState(): LoadingState {
  const fetchingCount = useIsFetching();

  const isAnyLoading = fetchingCount > 0;

  const status: LoadingStatus = isAnyLoading ? 'loading' : 'idle';

  return {
    isAnyLoading,
    loadingCount: fetchingCount,
    status,
    hasError: false,
  };
}
