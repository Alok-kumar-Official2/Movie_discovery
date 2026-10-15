/** Full category browser reusing MovieGrid for pagination and standard list states. */
import { useCallback } from 'react';
import type { ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MovieListItem } from '../api/types';
import { MovieCard } from '../components/movie/MovieCard';
import { MovieGrid } from '../components/movie/MovieGrid';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { useInfiniteMovies } from '../hooks/useMovieLists';
import type { RootStackParamList, RootStackScreenProps } from '../navigation/types';
import { getUserErrorMessage } from '../utils/errors';

export function SeeAllScreen({ route }: RootStackScreenProps<'SeeAll'>) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const moviesQuery = useInfiniteMovies(route.params.category);
  const movies = moviesQuery.data?.pages.flatMap((page) => page.results) ?? [];
  const openMovie = useCallback(
    (movieId: number) => navigation.navigate('MovieDetails', { movieId }),
    [navigation],
  );
  const renderMovie = useCallback<ListRenderItem<MovieListItem>>(
    ({ item }) => <MovieCard movie={item} onPress={openMovie} variant="grid" />,
    [openMovie],
  );
  const loadMore = () => {
    if (moviesQuery.hasNextPage && !moviesQuery.isFetchingNextPage) {
      void moviesQuery.fetchNextPage();
    }
  };

  return (
    <ScreenContainer edges={['left', 'right']}>
      <OfflineBanner />
      <MovieGrid
        emptyTitle="No movies found"
        emptyMessage="Try this category again later."
        errorMessage={
          moviesQuery.error
            ? getUserErrorMessage(moviesQuery.error, 'Unable to load this list.')
            : undefined
        }
        hasNextPage={moviesQuery.hasNextPage}
        isFetchingNextPage={moviesQuery.isFetchingNextPage}
        isLoading={moviesQuery.isLoading}
        items={movies}
        keyExtractor={(movie) => String(movie.id)}
        nextPageError={
          moviesQuery.isFetchNextPageError
            ? getUserErrorMessage(moviesQuery.error, 'Unable to load more movies.')
            : undefined
        }
        onLoadMore={loadMore}
        onRefresh={() => void moviesQuery.refetch()}
        onRetry={() => void moviesQuery.refetch()}
        refreshing={moviesQuery.isRefetching && !moviesQuery.isFetchingNextPage}
        renderItem={renderMovie}
      />
    </ScreenContainer>
  );
}
