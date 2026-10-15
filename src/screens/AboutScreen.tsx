/** Shares project and TMDB attribution information through the root navigation stack. */
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { colors, spacing, typography } from '../theme';

export function AboutScreen() {
  return (
    <ScreenContainer edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>About Movie Discovery</Text>
        <Text style={styles.body}>
          Discover movies, TV shows, and people with data provided by TMDB.
        </Text>
        <Text style={styles.attribution}>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.screenHorizontal,
    gap: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
  },
  attribution: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
    lineHeight: typography.lineHeight.body,
  },
});
