/** Combines genre, sort, year, and rating controls for the Explore header. */
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Genre } from '../../api/types';
import { colors, spacing, typography } from '../../theme';
import { ExploreGenreSelector } from './ExploreGenreSelector';
import { ExploreOptionList, RATING_OPTIONS, SORT_OPTIONS } from './ExploreOptionList';

export const DEFAULT_DISCOVER_SORT = 'popularity.desc';

interface ExploreFilterPanelProps {
  genres: Genre[];
  selectedGenreIds: number[];
  selectedSort: string;
  year: string;
  minimumRating: string;
  isLoadingGenres: boolean;
  genreError?: string;
  onRetryGenres: () => void;
  onToggleGenre: (genreId: number) => void;
  onSortChange: (sort: string) => void;
  onYearChange: (year: string) => void;
  onRatingChange: (rating: string) => void;
  onApply: () => void;
  onClear: () => void;
  isApplied: boolean;
}

export function ExploreFilterPanel({
  genres,
  selectedGenreIds,
  selectedSort,
  year,
  minimumRating,
  isLoadingGenres,
  genreError,
  onRetryGenres,
  onToggleGenre,
  onSortChange,
  onYearChange,
  onRatingChange,
  onApply,
  onClear,
  isApplied,
}: ExploreFilterPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.heading}>Genres</Text>
        {isApplied ? (
          <Pressable
            accessibilityLabel="Clear all Explore filters"
            accessibilityRole="button"
            onPress={onClear}
          >
            <Text style={styles.action}>Clear filters</Text>
          </Pressable>
        ) : null}
      </View>
      <ExploreGenreSelector
        genres={genres}
        selectedGenreIds={selectedGenreIds}
        isLoading={isLoadingGenres}
        error={genreError}
        onRetry={onRetryGenres}
        onToggle={onToggleGenre}
      />

      <ExploreOptionList
        title="Sort by"
        options={SORT_OPTIONS}
        selectedValue={selectedSort}
        onSelect={onSortChange}
      />

      <View style={styles.inputRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Release year</Text>
          <TextInput
            accessibilityLabel="Release year filter"
            keyboardType="number-pad"
            maxLength={4}
            onChangeText={(value) => onYearChange(value.replace(/\D/g, ''))}
            placeholder="Any year"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={year}
          />
        </View>
        <View style={styles.inputGroup}>
          <ExploreOptionList
            title="Minimum rating"
            options={RATING_OPTIONS}
            selectedValue={minimumRating}
            onSelect={onRatingChange}
            compact
          />
        </View>
      </View>
      <Pressable
        accessibilityLabel="Apply discovery filters"
        accessibilityRole="button"
        onPress={onApply}
        style={styles.applyButton}
      >
        <Text style={styles.applyText}>Apply filters</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.fontSize.subtitle,
    fontWeight: typography.fontWeight.semibold,
  },
  action: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    color: colors.accent,
    fontSize: typography.fontSize.small,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.fontSize.caption,
  },
  input: {
    minHeight: 40,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radiusSmall,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  applyButton: {
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.sm,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.accent,
  },
  applyText: {
    color: colors.background,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
});
