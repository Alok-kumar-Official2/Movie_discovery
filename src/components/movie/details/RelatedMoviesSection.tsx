/** Horizontal similar/recommended movie shelf with its own query state. */
import { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import type { MovieListItem } from '../../../api/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { DetailSection } from './DetailSection';
import { MovieCard } from '../MovieCard';
import { spacing } from '../../../theme';

interface RelatedMoviesSectionProps {
  title: string;
  movies?: MovieListItem[];
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export function RelatedMoviesSection({
  title,
  movies,
  isLoading,
  errorMessage,
  onRetry,
  navigation,
}: RelatedMoviesSectionProps) {
  const openMovie = useCallback(
    (movieId: number) => navigation.push('MovieDetails', { movieId }),
    [navigation],
  );
  const renderMovie = useCallback<ListRenderItem<MovieListItem>>(
    ({ item }) => <MovieCard movie={item} onPress={openMovie} />,
    [openMovie],
  );

  return (
    <DetailSection
      title={title}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={onRetry}
      hasData={Boolean(movies)}
      isEmpty={!movies?.length}
    >
      <FlatList
        contentContainerStyle={{ paddingLeft: spacing.screenHorizontal }}
        data={movies}
        horizontal
        initialNumToRender={5}
        keyExtractor={(movie) => String(movie.id)}
        maxToRenderPerBatch={5}
        renderItem={renderMovie}
        showsHorizontalScrollIndicator={false}
        windowSize={3}
      />
    </DetailSection>
  );
}
