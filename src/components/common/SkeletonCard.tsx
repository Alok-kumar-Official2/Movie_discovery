/** Animated-ready poster skeleton shared by movie, people, and TV lists. */
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../theme';

interface SkeletonCardProps {
  variant?: 'carousel' | 'grid';
}

export function SkeletonCard({ variant = 'carousel' }: SkeletonCardProps) {
  return (
    <View
      style={[styles.container, variant === 'grid' ? styles.gridContainer : null]}
      accessible={false}
    >
      <View style={styles.poster} />
      <View style={styles.title} />
      <View style={styles.subtitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 132,
    marginRight: spacing.sm,
  },
  gridContainer: {
    width: '100%',
    marginRight: 0,
    marginBottom: spacing.md,
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surfaceElevated,
  },
  title: {
    width: '82%',
    height: 14,
    marginTop: spacing.sm,
    borderRadius: spacing.radiusSmall,
    backgroundColor: colors.surfaceElevated,
  },
  subtitle: {
    width: '54%',
    height: 11,
    marginTop: spacing.xs,
    borderRadius: spacing.radiusSmall,
    backgroundColor: colors.surfaceElevated,
  },
});
