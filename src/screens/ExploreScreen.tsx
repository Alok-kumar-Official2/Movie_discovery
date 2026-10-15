/** Discovers movies from applied genre, sort, release-year, and rating filters. */
import { useCallback, useState } from 'react';
import type { ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MovieListItem, PopularPerson } from '../api/types';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { ExploreHeader } from '../components/movie/ExploreHeader';
import { DEFAULT_DISCOVER_SORT } from '../components/movie/ExploreFilterPanel';
import { MovieCard } from '../components/movie/MovieCard';
import { MovieGrid } from '../components/movie/MovieGrid';
import {
  useDiscoverMovies,
  useMovieGenres,
  usePopularPeople,
  type AppliedDiscoverFilters,
} from '../hooks/useDiscoveryQueries';
import type { RootStackParamList } from '../navigation/types';
import { getUserErrorMessage } from '../utils/errors';

const MINIMUM_VOTE_COUNT = 100;
const EMPTY_MOVIES: MovieListItem[] = [];
const EMPTY_PEOPLE: PopularPerson[] = [];

export function ExploreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [selectedSort, setSelectedSort] = useState(DEFAULT_DISCOVER_SORT);
  const [year, setYear] = useState('');
  const [minimumRating, setMinimumRating] = useState('');
  const [yearError, setYearError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<AppliedDiscoverFilters>({});
  const [isApplied, setIsApplied] = useState(false);
  const genresQuery = useMovieGenres();
  const peopleQuery = usePopularPeople();
  const discoverQuery = useDiscoverMovies(appliedFilters, isApplied);
  const movies =
    discoverQuery.data?.pages.flatMap((page) => page.results) ?? EMPTY_MOVIES;
  const people = peopleQuery.data?.results ?? EMPTY_PEOPLE;

  const toggleGenre = useCallback((genreId: number) => {
    setSelectedGenreIds((current) =>
      current.includes(genreId)
        ? current.filter((id) => id !== genreId)
        : [...current, genreId],
    );
  }, []);

  const applyFilters = useCallback(() => {
    if (year.length > 0 && !/^\d{4}$/.test(year)) {
      setYearError('Enter a four-digit release year.');
      return;
    }

    setYearError(null);
    const filters: AppliedDiscoverFilters = { sort_by: selectedSort };
    if (selectedGenreIds.length > 0) {
      filters.with_genres = selectedGenreIds.join('|');
    }
    if (year) {
      filters.primary_release_year = Number(year);
    }
    if (minimumRating) {
      filters['vote_average.gte'] = Number(minimumRating);
      filters['vote_count.gte'] = MINIMUM_VOTE_COUNT;
    }
    setAppliedFilters(filters);
    setIsApplied(true);
  }, [minimumRating, selectedGenreIds, selectedSort, year]);

  const clearFilters = useCallback(() => {
    setSelectedGenreIds([]);
    setSelectedSort(DEFAULT_DISCOVER_SORT);
    setYear('');
    setMinimumRating('');
    setYearError(null);
    setAppliedFilters({ sort_by: DEFAULT_DISCOVER_SORT });
    setIsApplied(true);
  }, []);

  const openMovie = useCallback(
    (movieId: number) => navigation.navigate('MovieDetails', { movieId }),
    [navigation],
  );
  const openPerson = useCallback(
    (personId: number) => navigation.navigate('PersonDetails', { personId }),
    [navigation],
  );
  const renderMovie = useCallback<ListRenderItem<MovieListItem>>(
    ({ item }) => <MovieCard movie={item} onPress={openMovie} variant="grid" />,
    [openMovie],
  );
  const loadMore = () => {
    if (discoverQuery.hasNextPage && !discoverQuery.isFetchingNextPage) {
      void discoverQuery.fetchNextPage();
    }
  };
  const header = (
    <ExploreHeader
      appliedFilters={appliedFilters}
      genres={genresQuery.data?.genres ?? []}
      genresError={
        genresQuery.error
          ? getUserErrorMessage(genresQuery.error, 'Genres could not be loaded.')
          : undefined
      }
      genresLoading={genresQuery.isLoading}
      isApplied={isApplied}
      minimumRating={minimumRating}
      onApply={applyFilters}
      onClear={clearFilters}
      onOpenPerson={openPerson}
      onRatingChange={setMinimumRating}
      onRetryGenres={() => void genresQuery.refetch()}
      onRetryPeople={() => void peopleQuery.refetch()}
      onSortChange={setSelectedSort}
      onToggleGenre={toggleGenre}
      onYearChange={(value) => {
        setYear(value);
        setYearError(null);
      }}
      people={people}
      peopleError={
        peopleQuery.error
          ? getUserErrorMessage(peopleQuery.error, 'Popular people could not be loaded.')
          : undefined
      }
      peopleLoading={peopleQuery.isLoading}
      selectedGenreIds={selectedGenreIds}
      selectedSort={selectedSort}
      year={year}
      yearError={yearError}
    />
  );

  return (
    <ScreenContainer>
      <OfflineBanner />
      <MovieGrid
        emptyTitle={isApplied ? 'No movies match these filters' : 'Find your next movie'}
        emptyMessage={
          isApplied
            ? 'Try removing a genre or changing the year and rating.'
            : 'Choose some filters, then tap Apply filters to explore.'
        }
        errorMessage={
          discoverQuery.error
            ? getUserErrorMessage(discoverQuery.error, 'Movies could not be loaded.')
            : undefined
        }
        hasNextPage={discoverQuery.hasNextPage}
        header={header}
        isFetchingNextPage={discoverQuery.isFetchingNextPage}
        isLoading={discoverQuery.isLoading}
        items={movies}
        keyExtractor={(movie) => String(movie.id)}
        nextPageError={
          discoverQuery.isFetchNextPageError
            ? getUserErrorMessage(discoverQuery.error, 'Unable to load more movies.')
            : undefined
        }
        onLoadMore={loadMore}
        onRefresh={isApplied ? () => void discoverQuery.refetch() : undefined}
        onRetry={() => void discoverQuery.refetch()}
        refreshing={discoverQuery.isRefetching && !discoverQuery.isFetchingNextPage}
        renderItem={renderMovie}
      />
    </ScreenContainer>
  );
}
