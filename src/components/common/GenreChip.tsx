/** Small genre pill for categorizing titles in detail headers. */
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface GenreChipProps {
  label: string;
}

export function GenreChip({ label }: GenreChipProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.surfaceElevated,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.caption,
  },
});
