/** Provides independently cached profile, filmography, TV detail, and paginated TV lists. */
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getPersonDetails,
  getPersonMovieCredits,
  getPopularTv,
  getTopRatedTv,
  getTvDetails,
} from '../api/endpoints';
import type {
  PersonDetailsResponse,
  PersonMovieCreditsResponse,
  TvDetailsResponse,
  TvListResponse,
} from '../api/types';

export type TvListCategory = 'popular' | 'topRated';

export function usePersonDetails(personId: number) {
  return useQuery<PersonDetailsResponse>({
    queryKey: ['person-details', personId],
    queryFn: () => getPersonDetails(personId),
    enabled: personId > 0,
  });
}

export function usePersonMovieCredits(personId: number) {
  return useQuery<PersonMovieCreditsResponse>({
    queryKey: ['person-movie-credits', personId],
    queryFn: () => getPersonMovieCredits(personId),
    enabled: personId > 0,
  });
}

export function useTvDetails(seriesId: number) {
  return useQuery<TvDetailsResponse>({
    queryKey: ['tv-details', seriesId],
    queryFn: () => getTvDetails(seriesId),
    enabled: seriesId > 0,
  });
}

export function useInfiniteTvList(category: TvListCategory, enabled = true) {
  return useInfiniteQuery<TvListResponse>({
    queryKey: ['tv-list', category],
    queryFn: ({ pageParam }) =>
      category === 'popular'
        ? getPopularTv({ page: pageParam as number })
        : getTopRatedTv({ page: pageParam as number }),
    initialPageParam: 1,
    enabled,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
