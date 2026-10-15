/** Owns cache keys and category routing for home and paginated movie lists. */
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getConfiguration,
  getMovieListForCategory,
  getTrendingMovies,
} from '../api/endpoints';
import type {
  ConfigurationResponse,
  MovieListResponse,
  TrendingTimeWindow,
} from '../api/types';
import type { SeeAllCategory } from '../navigation/types';
import { DEFAULT_REGION } from '../utils/constants';

export const movieQueryKeys = {
  configuration: ['configuration'] as const,
  trending: (timeWindow: TrendingTimeWindow) =>
    ['movies', 'trending', timeWindow] as const,
  categoryPage: (category: SeeAllCategory, region: string, page: number) =>
    ['movies', category, region, page] as const,
  infiniteCategory: (category: SeeAllCategory, region: string) =>
    ['movies', category, region, 'infinite'] as const,
};

/** Fetches image configuration once and lets React Query retain it for the session. */
export function useConfiguration() {
  return useQuery<ConfigurationResponse>({
    queryKey: movieQueryKeys.configuration,
    queryFn: getConfiguration,
    staleTime: Infinity,
  });
}

export function useTrendingMovies(timeWindow: TrendingTimeWindow) {
  return useQuery<MovieListResponse>({
    queryKey: movieQueryKeys.trending(timeWindow),
    queryFn: () => getTrendingMovies(timeWindow),
  });
}

export function useMovieList(
  category: SeeAllCategory,
  page = 1,
  region = DEFAULT_REGION,
) {
  return useQuery<MovieListResponse>({
    queryKey: movieQueryKeys.categoryPage(category, region, page),
    queryFn: () => getMovieListForCategory(category, { page, region }),
  });
}

export function useInfiniteMovies(category: SeeAllCategory, region = DEFAULT_REGION) {
  return useInfiniteQuery({
    queryKey: movieQueryKeys.infiniteCategory(category, region),
    queryFn: ({ pageParam }) =>
      getMovieListForCategory(category, { page: pageParam, region }),
    initialPageParam: 1,
    // Stop at TMDB's reported last page so the list does not send empty requests.
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
