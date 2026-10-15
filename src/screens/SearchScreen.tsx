/** Searches movies, TV shows, and people with debouncing and saved recent queries. */
import { useCallback, useState } from 'react';
import { ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MovieGrid } from '../components/movie/MovieGrid';
import { MovieCard } from '../components/movie/MovieCard';
import { SearchRecentList } from '../components/movie/SearchRecentList';
import { SearchResultCard } from '../components/movie/SearchResultCard';
import { SearchToolbar } from '../components/movie/SearchToolbar';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { ScreenContainer } from '../components/common/ScreenContainer';
import type { MovieListItem, MultiSearchItem } from '../api/types';
import { useSearchMovies, useSearchMulti } from '../hooks/useDiscoveryQueries';
import { useDebounce } from '../hooks/useDebounce';
import { useRecentSearches } from '../hooks/useRecentSearches';
import type { RootStackParamList } from '../navigation/types';
import { getUserErrorMessage } from '../utils/errors';

const SEARCH_DELAY_MS = 400;
const EMPTY_MOVIES: MovieListItem[] = [];
const EMPTY_MULTI: MultiSearchItem[] = [];

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [input, setInput] = useState('');
  const [moviesOnly, setMoviesOnly] = useState(false);
  const debouncedQuery = useDebounce(input.trim(), SEARCH_DELAY_MS);
  const {
    searches: recentSearches,
    isLoading: recentSearchesLoading,
    storageError,
    addSearch,
    clearSearches,
    retryStorage,
  } = useRecentSearches();
  const isSearching = debouncedQuery.length > 0;
  const multiQuery = useSearchMulti(debouncedQuery, isSearching && !moviesOnly);
  const moviesQuery = useSearchMovies(
    { query: debouncedQuery },
    isSearching && moviesOnly,
  );
  const multiItems =
    multiQuery.data?.pages.flatMap((page) => page.results) ?? EMPTY_MULTI;
  const movieItems =
    moviesQuery.data?.pages.flatMap((page) => page.results) ?? EMPTY_MOVIES;

  const rememberSearch = useCallback(() => {
    void addSearch(input);
  }, [addSearch, input]);

  const selectRecent = useCallback((query: string) => setInput(query), []);

  const openMultiResult = useCallback(
    (result: MultiSearchItem) => {
      switch (result.media_type) {
        case 'movie':
          navigation.navigate('MovieDetails', { movieId: result.id });
          break;
        case 'tv':
          navigation.navigate('TvDetails', { seriesId: result.id });
          break;
        case 'person':
          navigation.navigate('PersonDetails', { personId: result.id });
          break;
      }
    },
    [navigation],
  );
  const openMovie = useCallback(
    (movieId: number) => navigation.navigate('MovieDetails', { movieId }),
    [navigation],
  );
  const renderSearchItem = useCallback<ListRenderItem<MovieListItem | MultiSearchItem>>(
    ({ item }) =>
      'media_type' in item ? (
        <SearchResultCard result={item} onPress={openMultiResult} />
      ) : (
        <MovieCard movie={item} onPress={openMovie} variant="grid" />
      ),
    [openMovie, openMultiResult],
  );

  const query = moviesOnly ? moviesQuery : multiQuery;
  const items = moviesOnly ? movieItems : multiItems;
  const errorMessage = query.error
    ? getUserErrorMessage(query.error, 'Search is unavailable. Please try again.')
    : undefined;
  const onLoadMore = () => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  };
  const onRefresh = () => void query.refetch();

  return (
    <ScreenContainer>
      <OfflineBanner />
      <SearchToolbar
        moviesOnly={moviesOnly}
        onChangeText={setInput}
        onClear={() => setInput('')}
        onModeChange={setMoviesOnly}
        onSubmit={rememberSearch}
        value={input}
      />
      {isSearching ? (
        <MovieGrid<MovieListItem | MultiSearchItem>
          emptyTitle={`No results for "${debouncedQuery}"`}
          emptyMessage="Try a different title, show, or person."
          errorMessage={errorMessage}
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          isLoading={query.isLoading}
          items={items}
          keyExtractor={(item) =>
            `${'media_type' in item ? item.media_type : 'movie'}-${item.id}`
          }
          nextPageError={
            query.isFetchNextPageError
              ? getUserErrorMessage(query.error, 'Unable to load more results.')
              : undefined
          }
          onLoadMore={onLoadMore}
          onRefresh={onRefresh}
          onRetry={() => void query.refetch()}
          refreshing={query.isRefetching && !query.isFetchingNextPage}
          renderItem={renderSearchItem}
        />
      ) : (
        <SearchRecentList
          onClear={() => void clearSearches()}
          onSelect={selectRecent}
          onRetry={() => void retryStorage()}
          searches={recentSearches}
          isLoading={recentSearchesLoading}
          storageError={storageError}
        />
      )}
    </ScreenContainer>
  );
}
