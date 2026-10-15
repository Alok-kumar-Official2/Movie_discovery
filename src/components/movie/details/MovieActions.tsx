/** Keeps watchlist and trailer actions visually consistent in the movie header. */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../../theme';

interface MovieActionsProps {
  isWatchlisted: boolean;
  hasTrailer: boolean;
  onToggleWatchlist: () => void;
  onPlayTrailer: () => void;
}

export function MovieActions({
  isWatchlisted,
  hasTrailer,
  onToggleWatchlist,
  onPlayTrailer,
}: MovieActionsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
        accessibilityRole="button"
        accessibilityState={{ selected: isWatchlisted }}
        onPress={onToggleWatchlist}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>
          {isWatchlisted ? '✓ In Watchlist' : '+ Add to Watchlist'}
        </Text>
      </Pressable>
      {hasTrailer ? (
        <Pressable
          accessibilityLabel="Play movie trailer"
          accessibilityRole="button"
          onPress={onPlayTrailer}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>▶ Trailer</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sm,
  },
  secondaryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: spacing.radiusPill,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  primaryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.accent,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.bold,
  },
});
