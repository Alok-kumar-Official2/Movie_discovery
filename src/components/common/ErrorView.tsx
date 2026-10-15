/** Presents a user-safe error message with an explicit retry action. */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        accessibilityLabel="Retry loading content"
        accessibilityRole="button"
        onPress={onRetry}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.subtitle,
    fontWeight: typography.fontWeight.semibold,
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.background,
    fontWeight: typography.fontWeight.bold,
  },
});
