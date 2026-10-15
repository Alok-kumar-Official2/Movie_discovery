/** Loads a person profile and independently pageless movie filmography. */
import { useCallback } from 'react';
import type { ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MovieCardData } from '../api/types';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorView } from '../components/common/ErrorView';
import { Loader } from '../components/common/Loader';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { MovieCard } from '../components/movie/MovieCard';
import { MovieGrid } from '../components/movie/MovieGrid';
import { View } from 'react-native';
import { PersonProfile } from '../components/person/PersonProfile';
import { usePersonDetails, usePersonMovieCredits } from '../hooks/usePersonAndTv';
import type { RootStackParamList, RootStackScreenProps } from '../navigation/types';
import { getPersonFilmography } from '../utils/people';
import { getUserErrorMessage } from '../utils/errors';

export function PersonDetailsScreen({ route }: RootStackScreenProps<'PersonDetails'>) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { personId } = route.params;
  const personQuery = usePersonDetails(personId);
  const creditsQuery = usePersonMovieCredits(personId);
  const movies = creditsQuery.data ? getPersonFilmography(creditsQuery.data) : [];
  const openMovie = useCallback(
    (movieId: number) => navigation.navigate('MovieDetails', { movieId }),
    [navigation],
  );
  const renderMovie = useCallback<ListRenderItem<MovieCardData>>(
    ({ item }) => <MovieCard movie={item} onPress={openMovie} variant="grid" />,
    [openMovie],
  );

  if (personQuery.isLoading) {
    return (
      <ScreenContainer>
        <OfflineBanner />
        <Loader label="Loading person profile" />
      </ScreenContainer>
    );
  }

  if (personQuery.error && !personQuery.data) {
    return (
      <ScreenContainer>
        <OfflineBanner />
        <ErrorView
          message={getUserErrorMessage(
            personQuery.error,
            'Unable to load this person. Please try again.',
          )}
          onRetry={() => void personQuery.refetch()}
        />
      </ScreenContainer>
    );
  }

  if (!personQuery.data) {
    return (
      <ScreenContainer>
        <OfflineBanner />
        <EmptyState title="Person unavailable" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['left', 'right']}>
      <OfflineBanner />
      <MovieGrid
        emptyTitle="No filmography available"
        emptyMessage="This person's movie credits are not available yet."
        errorMessage={
          creditsQuery.error
            ? getUserErrorMessage(creditsQuery.error, 'Unable to load this filmography.')
            : undefined
        }
        header={
          <View>
            <PersonProfile person={personQuery.data} />
            {personQuery.error ? (
              <ErrorView
                message={getUserErrorMessage(
                  personQuery.error,
                  'Unable to refresh this person profile.',
                )}
                onRetry={() => void personQuery.refetch()}
              />
            ) : null}
          </View>
        }
        isLoading={creditsQuery.isLoading}
        items={movies}
        keyExtractor={(movie) => String(movie.id)}
        onRefresh={() => void creditsQuery.refetch()}
        onRetry={() => void creditsQuery.refetch()}
        refreshing={creditsQuery.isRefetching}
        renderItem={renderMovie}
      />
    </ScreenContainer>
  );
}
