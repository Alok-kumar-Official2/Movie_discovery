/** Composes independently queried detail sections after the movie core loads. */
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MovieDetailsResponse } from '../../../api/types';
import { ScreenContainer } from '../../common/ScreenContainer';
import { ErrorView } from '../../common/ErrorView';
import { OfflineBanner } from '../../common/OfflineBanner';
import { CreditsSection } from './CreditsSection';
import { GalleryStrip } from './GalleryStrip';
import { MovieHeroSection } from './MovieHeroSection';
import { MovieInfoSection } from './MovieInfoSection';
import { OverviewSection } from './OverviewSection';
import { ProvidersSection } from './ProvidersSection';
import { RelatedMoviesSection } from './RelatedMoviesSection';
import { ReviewsSection } from './ReviewsSection';
import { TrailerModal } from './TrailerModal';
import {
  useMovieCredits,
  useMovieImages,
  useMovieRecommendations,
  useMovieReviews,
  useMovieVideos,
  useMovieWatchProviders,
  useSimilarMovies,
} from '../../../hooks/useMovieDetails';
import type { RootStackParamList } from '../../../navigation/types';
import { spacing } from '../../../theme';
import { getUserErrorMessage } from '../../../utils/errors';
import { selectMovieTrailer } from '../../../utils/movies';
import { useWatchlist } from '../../../context/WatchlistContext';

interface MovieDetailsContentProps {
  movieId: number;
  movie: MovieDetailsResponse;
  refreshErrorMessage?: string;
  onRetryMovie: () => void;
}

export function MovieDetailsContent({
  movieId,
  movie,
  refreshErrorMessage,
  onRetryMovie,
}: MovieDetailsContentProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [trailerVideoId, setTrailerVideoId] = useState<string | null>(null);
  const { add, remove, isInWatchlist } = useWatchlist();
  const isWatchlisted = isInWatchlist(movie.id);

  const credits = useMovieCredits(movieId);
  const videos = useMovieVideos(movieId);
  const reviews = useMovieReviews(movieId);
  const similar = useSimilarMovies(movieId);
  const recommendations = useMovieRecommendations(movieId);
  const providers = useMovieWatchProviders(movieId);
  const images = useMovieImages(movieId);
  const trailer = videos.data ? selectMovieTrailer(videos.data.results) : undefined;

  const retry = useCallback(
    (error: unknown, fallback: string) =>
      error ? getUserErrorMessage(error, fallback) : undefined,
    [],
  );
  const openPerson = useCallback(
    (personId: number) => navigation.navigate('PersonDetails', { personId }),
    [navigation],
  );

  return (
    <ScreenContainer edges={['left', 'right']}>
      <OfflineBanner />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {refreshErrorMessage ? (
          <ErrorView message={refreshErrorMessage} onRetry={onRetryMovie} />
        ) : null}
        <MovieHeroSection
          movie={movie}
          isWatchlisted={isWatchlisted}
          hasTrailer={Boolean(trailer)}
          onToggleWatchlist={() => {
            const savedMovie = {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
            };
            void (isWatchlisted ? remove(movie.id) : add(savedMovie));
          }}
          onPlayTrailer={() => setTrailerVideoId(trailer?.key ?? null)}
        />
        <OverviewSection overview={movie.overview} />
        {videos.error ? (
          <ErrorView
            message={getUserErrorMessage(
              videos.error,
              'Unable to load the movie trailer.',
            )}
            onRetry={() => void videos.refetch()}
          />
        ) : null}
        <CreditsSection
          credits={credits.data}
          isLoading={credits.isLoading}
          errorMessage={retry(credits.error, 'Unable to load movie credits.')}
          onRetry={() => void credits.refetch()}
          onPersonPress={openPerson}
        />
        <MovieInfoSection movie={movie} />
        <ProvidersSection
          providers={providers.data}
          isLoading={providers.isLoading}
          errorMessage={retry(providers.error, 'Unable to load watch providers.')}
          onRetry={() => void providers.refetch()}
        />
        <ReviewsSection
          reviews={reviews.data}
          isLoading={reviews.isLoading}
          errorMessage={retry(reviews.error, 'Unable to load reviews.')}
          onRetry={() => void reviews.refetch()}
        />
        <RelatedMoviesSection
          title="Similar Movies"
          movies={similar.data?.results}
          isLoading={similar.isLoading}
          errorMessage={retry(similar.error, 'Unable to load similar movies.')}
          onRetry={() => void similar.refetch()}
          navigation={navigation}
        />
        <RelatedMoviesSection
          title="Recommended"
          movies={recommendations.data?.results}
          isLoading={recommendations.isLoading}
          errorMessage={retry(recommendations.error, 'Unable to load recommendations.')}
          onRetry={() => void recommendations.refetch()}
          navigation={navigation}
        />
        <GalleryStrip
          movieId={movieId}
          images={images.data}
          isLoading={images.isLoading}
          errorMessage={retry(images.error, 'Unable to load movie images.')}
          onRetry={() => void images.refetch()}
          navigation={navigation}
        />
      </ScrollView>
      <TrailerModal videoId={trailerVideoId} onClose={() => setTrailerVideoId(null)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
  },
});
