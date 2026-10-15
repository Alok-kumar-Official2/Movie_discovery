/** Loads essential movie identity and delegates optional sections independently. */
import { StyleSheet } from 'react-native';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorView } from '../components/common/ErrorView';
import { Loader } from '../components/common/Loader';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { MovieDetailsContent } from '../components/movie/details/MovieDetailsContent';
import { useMovieDetails } from '../hooks/useMovieDetails';
import type { RootStackScreenProps } from '../navigation/types';
import { spacing } from '../theme';
import { getUserErrorMessage } from '../utils/errors';

export function MovieDetailsScreen({ route }: RootStackScreenProps<'MovieDetails'>) {
  const { movieId } = route.params;
  const movieQuery = useMovieDetails(movieId);

  if (movieQuery.isLoading) {
    return (
      <ScreenContainer style={styles.state}>
        <OfflineBanner />
        <Loader label="Loading movie details" />
      </ScreenContainer>
    );
  }

  if (movieQuery.error && !movieQuery.data) {
    return (
      <ScreenContainer style={styles.state}>
        <OfflineBanner />
        <ErrorView
          message={getUserErrorMessage(
            movieQuery.error,
            'Unable to load this movie. Please try again.',
          )}
          onRetry={() => void movieQuery.refetch()}
        />
      </ScreenContainer>
    );
  }

  if (!movieQuery.data) {
    return (
      <ScreenContainer style={styles.state}>
        <OfflineBanner />
        <EmptyState title="Movie unavailable" />
      </ScreenContainer>
    );
  }

  return (
    <MovieDetailsContent
      movieId={movieId}
      movie={movieQuery.data}
      refreshErrorMessage={
        movieQuery.error
          ? getUserErrorMessage(
              movieQuery.error,
              'Unable to refresh this movie. Showing saved details.',
            )
          : undefined
      }
      onRetryMovie={() => void movieQuery.refetch()}
    />
  );
}

const styles = StyleSheet.create({
  state: {
    justifyContent: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
});
