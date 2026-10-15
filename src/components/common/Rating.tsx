/** Compact, accessible TMDB score display used by movie and TV cards. */
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { formatRating } from '../../utils/formatters';

interface RatingProps {
  value: number | null | undefined;
}

export function Rating({ value }: RatingProps) {
  const rating = formatRating(value);
  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={rating === 'NR' ? 'Not rated' : `Rating ${rating} out of 10`}
    >
      <Text style={styles.star}>★</Text>
      <Text style={styles.value}>{rating}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  star: {
    color: colors.accent,
    fontSize: typography.fontSize.small,
  },
  value: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
});
