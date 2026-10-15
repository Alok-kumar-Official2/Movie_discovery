/** Exposes paginated search/discovery data and popular people to browse screens. */
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  discoverMovies,
  getMovieGenres,
  getPopularPeople,
  searchMovies,
  searchMulti,
} from '../api/endpoints';
import type {
  DiscoverMovieParams,
  GenreListResponse,
  MovieListResponse,
  MultiSearchResponse,
  PopularPeopleResponse,
  SearchMovieParams,
} from '../api/types';

export type AppliedDiscoverFilters = Omit<
  DiscoverMovieParams,
  'page' | 'include_adult' | 'language'
>;

export function useMovieGenres() {
  return useQuery<GenreListResponse>({
    queryKey: ['movie-genres'],
    queryFn: () => getMovieGenres(),
    staleTime: Infinity,
  });
}

export function useSearchMulti(query: string, enabled: boolean) {
  return useInfiniteQuery<MultiSearchResponse>({
    queryKey: ['search', 'multi', query],
    queryFn: ({ pageParam }) => searchMulti({ query, page: pageParam as number }),
    initialPageParam: 1,
    // Each search/discovery endpoint reports its own page count; do not guess from item count.
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled,
  });
}

export function useSearchMovies(params: SearchMovieParams, enabled: boolean) {
  return useInfiniteQuery<MovieListResponse>({
    queryKey: ['search', 'movies', params.query],
    queryFn: ({ pageParam }) => searchMovies({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled,
  });
}

export function useDiscoverMovies(filters: AppliedDiscoverFilters, enabled: boolean) {
  return useInfiniteQuery<MovieListResponse>({
    queryKey: ['discover', 'movies', filters],
    queryFn: ({ pageParam }) => discoverMovies({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled,
  });
}

export function usePopularPeople() {
  return useQuery<PopularPeopleResponse>({
    queryKey: ['people', 'popular', 1],
    queryFn: () => getPopularPeople({ page: 1 }),
  });
}
