/** Independent loading, error, empty, and success states for a movie section. */
import { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MovieListItem } from '../../api/types';
import type { RootStackParamList, SeeAllCategory } from '../../navigation/types';
import { spacing } from '../../theme';
import { EmptyState } from '../common/EmptyState';
import { ErrorView } from '../common/ErrorView';
import { SectionHeader } from '../common/SectionHeader';
import { SkeletonCard } from '../common/SkeletonCard';
import { MovieCard } from './MovieCard';

interface MovieCarouselProps {
  title: string;
  category: SeeAllCategory;
  movies?: MovieListItem[];
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const SKELETON_KEYS = ['first', 'second', 'third', 'fourth'] as const;

export function MovieCarousel({
  title,
  category,
  movies,
  isLoading,
  errorMessage,
  onRetry,
  navigation,
}: MovieCarouselProps) {
  const openMovie = useCallback(
    (movieId: number) => navigation.navigate('MovieDetails', { movieId }),
    [navigation],
  );
  const openSeeAll = useCallback(
    () => navigation.navigate('SeeAll', { category, title }),
    [category, navigation, title],
  );
  const renderMovie = useCallback<ListRenderItem<MovieListItem>>(
    ({ item }) => <MovieCard movie={item} onPress={openMovie} />,
    [openMovie],
  );

  return (
    <View style={styles.section}>
      <SectionHeader title={title} actionLabel="See All" onActionPress={openSeeAll} />
      {isLoading && !movies?.length ? (
        <FlatList
          data={SKELETON_KEYS}
          horizontal
          initialNumToRender={4}
          keyExtractor={(key) => key}
          maxToRenderPerBatch={4}
          renderItem={() => <SkeletonCard />}
          showsHorizontalScrollIndicator={false}
          windowSize={3}
        />
      ) : errorMessage && !movies?.length ? (
        <ErrorView message={errorMessage} onRetry={onRetry} />
      ) : !movies?.length ? (
        <EmptyState title="No movies found" message="Check back later for new titles." />
      ) : (
        <>
          {errorMessage ? <ErrorView message={errorMessage} onRetry={onRetry} /> : null}
          <FlatList
            data={movies}
            horizontal
            initialNumToRender={5}
            keyExtractor={(movie) => String(movie.id)}
            maxToRenderPerBatch={5}
            renderItem={renderMovie}
            showsHorizontalScrollIndicator={false}
            windowSize={3}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingLeft: spacing.screenHorizontal,
    marginBottom: spacing.lg,
  },
});
