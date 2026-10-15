/** Centered progress feedback for short actions and non-list loading states. */
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface LoaderProps {
  label?: string;
}

export function Loader({ label = 'Loading' }: LoaderProps) {
  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator color={colors.accent} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
  },
});
