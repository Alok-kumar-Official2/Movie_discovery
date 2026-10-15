/** Cached provider artwork tile shared by streaming availability sections. */
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import type { WatchProvider } from '../../api/types';
import { colors, spacing, typography } from '../../theme';
import { imageUrl } from '../../utils/formatters';

interface ProviderLogoProps {
  provider: WatchProvider;
}

function ProviderLogoComponent({ provider }: ProviderLogoProps) {
  return (
    <View style={styles.container}>
      <Image
        accessibilityLabel={`${provider.provider_name} logo`}
        contentFit="cover"
        source={{ uri: imageUrl(provider.logo_path, 'w92') }}
        style={styles.logo}
      />
      <Text numberOfLines={2} style={styles.name}>
        {provider.provider_name}
      </Text>
    </View>
  );
}

export const ProviderLogo = memo(ProviderLogoComponent);

const styles = StyleSheet.create({
  container: {
    width: 76,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surfaceElevated,
  },
  name: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.fontSize.caption,
    textAlign: 'center',
  },
});
