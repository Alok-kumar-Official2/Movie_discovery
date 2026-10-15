/** Composes people recommendations, discovery filters, and the applied-filter summary. */
import { StyleSheet, Text, View } from 'react-native';
import type { Genre, PopularPerson } from '../../api/types';
import type { AppliedDiscoverFilters } from '../../hooks/useDiscoveryQueries';
import { colors, spacing, typography } from '../../theme';
import { DEFAULT_DISCOVER_SORT, ExploreFilterPanel } from './ExploreFilterPanel';
import { PopularPeopleSection } from './PopularPeopleSection';

interface ExploreHeaderProps {
  genres: Genre[];
  selectedGenreIds: number[];
  selectedSort: string;
  year: string;
  minimumRating: string;
  genresLoading: boolean;
  genresError?: string;
  onRetryGenres: () => void;
  onToggleGenre: (genreId: number) => void;
  onSortChange: (sort: string) => void;
  onYearChange: (year: string) => void;
  onRatingChange: (rating: string) => void;
  onApply: () => void;
  onClear: () => void;
  isApplied: boolean;
  appliedFilters: AppliedDiscoverFilters;
  people: PopularPerson[];
  peopleLoading: boolean;
  peopleError?: string;
  onRetryPeople: () => void;
  onOpenPerson: (personId: number) => void;
  yearError: string | null;
}

export function ExploreHeader(props: ExploreHeaderProps) {
  const {
    genres,
    selectedGenreIds,
    selectedSort,
    year,
    minimumRating,
    genresLoading,
    genresError,
    onRetryGenres,
    onToggleGenre,
    onSortChange,
    onYearChange,
    onRatingChange,
    onApply,
    onClear,
    isApplied,
    appliedFilters,
    people,
    peopleLoading,
    peopleError,
    onRetryPeople,
    onOpenPerson,
    yearError,
  } = props;

  return (
    <View>
      <PopularPeopleSection
        error={peopleError}
        isLoading={peopleLoading}
        onOpenPerson={onOpenPerson}
        onRetry={onRetryPeople}
        people={people}
      />
      <ExploreFilterPanel
        genres={genres}
        isApplied={isApplied}
        isLoadingGenres={genresLoading}
        genreError={genresError}
        minimumRating={minimumRating}
        onApply={onApply}
        onClear={onClear}
        onRatingChange={onRatingChange}
        onRetryGenres={onRetryGenres}
        onSortChange={onSortChange}
        onToggleGenre={onToggleGenre}
        onYearChange={onYearChange}
        selectedGenreIds={selectedGenreIds}
        selectedSort={selectedSort}
        year={year}
      />
      {yearError ? <Text style={styles.validation}>{yearError}</Text> : null}
      <View style={styles.resultsHeading}>
        <Text style={styles.resultsTitle}>Discover</Text>
        <Text style={styles.summary}>
          {getFilterSummary(appliedFilters, genres, isApplied)}
        </Text>
      </View>
    </View>
  );
}

function getFilterSummary(
  filters: AppliedDiscoverFilters,
  genres: Genre[],
  isApplied: boolean,
): string {
  if (!isApplied) {
    return 'Filters have not been applied';
  }

  const selectedIds = (filters.with_genres ?? '').split('|').filter(Boolean).map(Number);
  const selectedNames = genres
    .filter((genre) => selectedIds.includes(genre.id))
    .map((genre) => genre.name);
  const sort = filters.sort_by ?? DEFAULT_DISCOVER_SORT;
  const sortLabel =
    sort === 'vote_average.desc'
      ? 'Top rated'
      : sort === 'primary_release_date.desc'
        ? 'Newest'
        : sort === 'revenue.desc'
          ? 'Revenue'
          : 'Popular';
  const parts = [sortLabel];
  if (selectedNames.length) parts.push(selectedNames.join(' or '));
  if (filters.primary_release_year) {
    parts.push(String(filters.primary_release_year));
  }
  if (filters['vote_average.gte']) {
    parts.push(`${filters['vote_average.gte']}+ rating`);
  }
  return parts.join(' • ');
}

const styles = StyleSheet.create({
  validation: {
    marginHorizontal: spacing.screenHorizontal,
    color: colors.danger,
    fontSize: typography.fontSize.small,
  },
  resultsHeading: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.sm,
  },
  resultsTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
  },
  summary: {
    marginTop: spacing.xxs,
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
  },
});
