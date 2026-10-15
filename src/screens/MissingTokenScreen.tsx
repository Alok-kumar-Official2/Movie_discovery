/** Blocks API-backed navigation until the developer configures a private token. */
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { colors, spacing, typography } from '../theme';

export function MissingTokenScreen() {
  return (
    <ScreenContainer style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Missing API token</Text>
        <Text style={styles.message}>
          Add your TMDB read access token to a local .env file as EXPO_PUBLIC_TMDB_TOKEN,
          then restart Expo. Never commit that file.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: {
    gap: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    textAlign: 'center',
  },
});
