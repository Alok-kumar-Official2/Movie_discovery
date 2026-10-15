/** Calm, reusable explanation for valid queries that return no content. */
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({
  title,
  message = 'Try changing your filters or search terms.',
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.subtitle,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
    textAlign: 'center',
  },
});
