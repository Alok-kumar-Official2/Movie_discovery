/** Keeps an unobtrusive network warning visible while cached content remains usable. */
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export function OfflineBanner() {
  const isOffline = useNetworkStatus();
  if (!isOffline) {
    return null;
  }

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>You are offline. Showing available cached content.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceElevated,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  text: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.caption,
    textAlign: 'center',
  },
});
