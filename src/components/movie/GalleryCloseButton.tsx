/** Provides the consistent accessible close action used by gallery states and viewer. */
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface GalleryCloseButtonProps {
  onPress: () => void;
  top: number;
}

export function GalleryCloseButton({ onPress, top }: GalleryCloseButtonProps) {
  return (
    <Pressable
      accessibilityLabel="Close gallery"
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, { top }]}
    >
      <Text style={styles.text}>Close</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.surfaceElevated,
  },
  text: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
});
