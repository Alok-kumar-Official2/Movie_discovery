/** Keeps each movie-detail endpoint in its own independently retryable query. */
import { useQuery } from '@tanstack/react-query';
import {
  getMovieCredits,
  getMovieDetails,
  getMovieImages,
  getMovieRecommendations,
  getMovieReviews,
  getMovieVideos,
  getMovieWatchProviders,
  getSimilarMovies,
} from '../api/endpoints';
import { DEFAULT_REGION } from '../utils/constants';

const movieDetailKeys = {
  details: (movieId: number) => ['movie-details', movieId] as const,
  credits: (movieId: number) => ['movie-credits', movieId] as const,
  videos: (movieId: number) => ['movie-videos', movieId] as const,
  reviews: (movieId: number) => ['movie-reviews', movieId] as const,
  similar: (movieId: number) => ['movie-similar', movieId] as const,
  recommendations: (movieId: number) => ['movie-recommendations', movieId] as const,
  providers: (movieId: number, region: string) =>
    ['movie-providers', movieId, region] as const,
  images: (movieId: number) => ['movie-images', movieId] as const,
};

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: movieDetailKeys.details(movieId),
    queryFn: () => getMovieDetails(movieId),
    enabled: movieId > 0,
  });
}

export function useMovieCredits(movieId: number) {
  return useQuery({
    queryKey: movieDetailKeys.credits(movieId),
    queryFn: () => getMovieCredits(movieId),
    enabled: movieId > 0,
  });
}

export function useMovieVideos(movieId: number) {
  return useQuery({
    queryKey: movieDetailKeys.videos(movieId),
    queryFn: () => getMovieVideos(movieId),
    enabled: movieId > 0,
  });
}

export function useMovieReviews(movieId: number) {
  return useQuery({
    queryKey: movieDetailKeys.reviews(movieId),
    queryFn: () => getMovieReviews(movieId),
    enabled: movieId > 0,
  });
}

export function useSimilarMovies(movieId: number) {
  return useQuery({
    queryKey: movieDetailKeys.similar(movieId),
    queryFn: () => getSimilarMovies(movieId),
    enabled: movieId > 0,
  });
}

export function useMovieRecommendations(movieId: number) {
  return useQuery({
    queryKey: movieDetailKeys.recommendations(movieId),
    queryFn: () => getMovieRecommendations(movieId),
    enabled: movieId > 0,
  });
}

export function useMovieWatchProviders(movieId: number, region = DEFAULT_REGION) {
  return useQuery({
    queryKey: movieDetailKeys.providers(movieId, region),
    queryFn: () => getMovieWatchProviders(movieId),
    enabled: movieId > 0,
  });
}

export function useMovieImages(movieId: number) {
  return useQuery({
    queryKey: movieDetailKeys.images(movieId),
    queryFn: () => getMovieImages(movieId),
    enabled: movieId > 0,
  });
}
