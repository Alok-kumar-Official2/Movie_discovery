/** Typed TMDB requests grouped by configuration, media, discovery, and people. */
import { apiClient } from './client';
import {
  ConfigurationResponse,
  DiscoverMovieParams,
  DatedMovieListResponse,
  GenreListResponse,
  LanguageParams,
  MovieCreditsResponse,
  MovieDetailsResponse,
  MovieImagesResponse,
  MovieListResponse,
  MovieReviewsResponse,
  MovieWatchProvidersResponse,
  MovieVideosResponse,
  MultiSearchResponse,
  PageParams,
  PersonDetailsResponse,
  PersonMovieCreditsResponse,
  PopularPeopleResponse,
  RegionPageParams,
  SearchMovieParams,
  SearchMultiParams,
  TrendingTimeWindow,
  TvDetailsResponse,
  TvListResponse,
} from './types';
import type { SeeAllCategory } from '../navigation/types';
import { API_LANGUAGE, DEFAULT_IMAGE_LANGUAGE, DEFAULT_PAGE } from '../utils/constants';

const NO_LANGUAGE_PARAMS = { language: null };

/** Supplies the documented default language while preserving caller filters. */
function withLanguage<TParams extends LanguageParams>(
  params?: TParams,
): TParams & { language: string } {
  return Object.assign({}, params, {
    language: params?.language ?? API_LANGUAGE,
  });
}

export function getConfiguration(): Promise<ConfigurationResponse> {
  return apiClient
    .get<ConfigurationResponse>('/configuration', {
      params: NO_LANGUAGE_PARAMS,
    })
    .then((response) => response.data);
}

export function getMovieGenres(params?: LanguageParams): Promise<GenreListResponse> {
  return apiClient
    .get<GenreListResponse>('/genre/movie/list', {
      params: withLanguage(params),
    })
    .then((response) => response.data);
}

export function getTrendingMovies(
  timeWindow: TrendingTimeWindow,
  params?: LanguageParams,
): Promise<MovieListResponse> {
  return apiClient
    .get<MovieListResponse>(`/trending/movie/${timeWindow}`, {
      params: withLanguage(params),
    })
    .then((response) => response.data);
}

/** Keeps the four home/See All collections mapped to their documented API routes. */
export function getMovieListForCategory(
  category: SeeAllCategory,
  params?: RegionPageParams,
): Promise<MovieListResponse> {
  switch (category) {
    case 'nowPlaying':
      return getNowPlayingMovies(params);
    case 'popular':
      return getPopularMovies(params);
    case 'topRated':
      return getTopRatedMovies(params);
    case 'upcoming':
      return getUpcomingMovies(params);
  }
}

export function getNowPlayingMovies(
  params?: RegionPageParams,
): Promise<DatedMovieListResponse> {
  return apiClient
    .get<DatedMovieListResponse>('/movie/now_playing', {
      params: withLanguage({ page: DEFAULT_PAGE, ...params }),
    })
    .then((response) => response.data);
}

export function getPopularMovies(params?: RegionPageParams): Promise<MovieListResponse> {
  return apiClient
    .get<MovieListResponse>('/movie/popular', {
      params: withLanguage({ page: DEFAULT_PAGE, ...params }),
    })
    .then((response) => response.data);
}

export function getTopRatedMovies(params?: RegionPageParams): Promise<MovieListResponse> {
  return apiClient
    .get<MovieListResponse>('/movie/top_rated', {
      params: withLanguage({ page: DEFAULT_PAGE, ...params }),
    })
    .then((response) => response.data);
}

export function getUpcomingMovies(
  params?: RegionPageParams,
): Promise<DatedMovieListResponse> {
  return apiClient
    .get<DatedMovieListResponse>('/movie/upcoming', {
      params: withLanguage({ page: DEFAULT_PAGE, ...params }),
    })
    .then((response) => response.data);
}

export function getMovieDetails(
  movieId: number,
  params?: LanguageParams,
): Promise<MovieDetailsResponse> {
  return apiClient
    .get<MovieDetailsResponse>(`/movie/${movieId}`, {
      params: withLanguage(params),
    })
    .then((response) => response.data);
}

export function getMovieCredits(
  movieId: number,
  params?: LanguageParams,
): Promise<MovieCreditsResponse> {
  return apiClient
    .get<MovieCreditsResponse>(`/movie/${movieId}/credits`, {
      params: withLanguage(params),
    })
    .then((response) => response.data);
}

export function getMovieVideos(
  movieId: number,
  params?: LanguageParams,
): Promise<MovieVideosResponse> {
  return apiClient
    .get<MovieVideosResponse>(`/movie/${movieId}/videos`, {
      params: withLanguage(params),
    })
    .then((response) => response.data);
}

export function getMovieReviews(
  movieId: number,
  params?: PageParams,
): Promise<MovieReviewsResponse> {
  return apiClient
    .get<MovieReviewsResponse>(`/movie/${movieId}/reviews`, {
      params: withLanguage({ page: DEFAULT_PAGE, ...params }),
    })
    .then((response) => response.data);
}

export function getSimilarMovies(
  movieId: number,
  params?: PageParams,
): Promise<MovieListResponse> {
  return apiClient
    .get<MovieListResponse>(`/movie/${movieId}/similar`, {
      params: withLanguage({ page: DEFAULT_PAGE, ...params }),
    })
    .then((response) => response.data);
}

export function getMovieRecommendations(
  movieId: number,
  params?: PageParams,
): Promise<MovieListResponse> {
  return apiClient
    .get<MovieListResponse>(`/movie/${movieId}/recommendations`, {
      params: withLanguage({ page: DEFAULT_PAGE, ...params }),
    })
    .then((response) => response.data);
}

export function getMovieWatchProviders(
  movieId: number,
): Promise<MovieWatchProvidersResponse> {
  return apiClient
    .get<MovieWatchProvidersResponse>(`/movie/${movieId}/watch/providers`, {
      params: NO_LANGUAGE_PARAMS,
    })
    .then((response) => response.data);
}

export function getMovieImages(
  movieId: number,
  includeImageLanguage = DEFAULT_IMAGE_LANGUAGE,
): Promise<MovieImagesResponse> {
  return apiClient
    .get<MovieImagesResponse>(`/movie/${movieId}/images`, {
      params: {
        include_image_language: includeImageLanguage,
        ...NO_LANGUAGE_PARAMS,
      },
    })
    .then((response) => response.data);
}

export function searchMovies(params: SearchMovieParams): Promise<MovieListResponse> {
  return apiClient
    .get<MovieListResponse>('/search/movie', {
      params: withLanguage({ include_adult: false, ...params }),
    })
    .then((response) => response.data);
}

export function searchMulti(params: SearchMultiParams): Promise<MultiSearchResponse> {
  return apiClient
    .get<MultiSearchResponse>('/search/multi', {
      params: withLanguage({ include_adult: false, ...params }),
    })
    .then((response) => response.data);
}

export function discoverMovies(params?: DiscoverMovieParams): Promise<MovieListResponse> {
  return apiClient
    .get<MovieListResponse>('/discover/movie', {
      params: withLanguage({ include_adult: false, ...params }),
    })
    .then((response) => response.data);
}

export function getPopularPeople(params?: PageParams): Promise<PopularPeopleResponse> {
  return apiClient
    .get<PopularPeopleResponse>('/person/popular', {
      params: withLanguage({ page: DEFAULT_PAGE, ...params }),
    })
    .then((response) => response.data);
}

export function getPersonDetails(
  personId: number,
  params?: LanguageParams,
): Promise<PersonDetailsResponse> {
  return apiClient
    .get<PersonDetailsResponse>(`/person/${personId}`, {
      params: withLanguage(params),
    })
    .then((response) => response.data);
}

export function getPersonMovieCredits(
  personId: number,
  params?: LanguageParams,
): Promise<PersonMovieCreditsResponse> {
  return apiClient
    .get<PersonMovieCreditsResponse>(`/person/${personId}/movie_credits`, {
      params: withLanguage(params),
    })
    .then((response) => response.data);
}

export function getPopularTv(params?: PageParams): Promise<TvListResponse> {
  return apiClient
    .get<TvListResponse>('/tv/popular', {
      params: withLanguage({ page: DEFAULT_PAGE, ...params }),
    })
    .then((response) => response.data);
}

export function getTopRatedTv(params?: PageParams): Promise<TvListResponse> {
  return apiClient
    .get<TvListResponse>('/tv/top_rated', {
      params: withLanguage({ page: DEFAULT_PAGE, ...params }),
    })
    .then((response) => response.data);
}

export function getTvDetails(
  seriesId: number,
  params?: LanguageParams,
): Promise<TvDetailsResponse> {
  return apiClient
    .get<TvDetailsResponse>(`/tv/${seriesId}`, {
      params: withLanguage(params),
    })
    .then((response) => response.data);
}
