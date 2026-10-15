/** Shows genre choices and keeps their loading and retry states beside the controls. */
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import type { Genre } from '../../api/types';
import { colors, spacing, typography } from '../../theme';

interface ExploreGenreSelectorProps {
  genres: Genre[];
  selectedGenreIds: number[];
  isLoading: boolean;
  error?: string;
  onRetry: () => void;
  onToggle: (genreId: number) => void;
}

export function ExploreGenreSelector({
  genres,
  selectedGenreIds,
  isLoading,
  error,
  onRetry,
  onToggle,
}: ExploreGenreSelectorProps) {
  if (error) {
    return (
      <Pressable
        accessibilityLabel="Retry loading movie genres"
        accessibilityRole="button"
        onPress={onRetry}
      >
        <Text style={styles.error}>{error} Tap to retry.</Text>
      </Pressable>
    );
  }

  if (isLoading) {
    return <Text style={styles.help}>Loading genres…</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {genres.map((genre) => {
        const selected = selectedGenreIds.includes(genre.id);
        return (
          <Pressable
            accessibilityLabel={`${selected ? 'Remove' : 'Add'} ${genre.name} genre`}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
            key={genre.id}
            onPress={() => onToggle(genre.id)}
            style={[styles.chip, selected ? styles.selectedChip : null]}
          >
            <Text style={[styles.chipText, selected ? styles.selectedText : null]}>
              {genre.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginRight: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.surface,
  },
  selectedChip: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.caption,
  },
  selectedText: {
    color: colors.background,
    fontWeight: typography.fontWeight.semibold,
  },
  help: {
    color: colors.textMuted,
    fontSize: typography.fontSize.small,
  },
  error: {
    color: colors.danger,
    fontSize: typography.fontSize.small,
  },
});
