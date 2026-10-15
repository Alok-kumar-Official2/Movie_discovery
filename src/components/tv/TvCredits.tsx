/** Shows the series' creator profiles and broadcasting network logos. */
import { CachedImage as Image } from '../common/CachedImage';
import { StyleSheet, Text, View } from 'react-native';
import type { TvCreator, TvNetwork } from '../../api/types';
import { colors, spacing, typography } from '../../theme';
import { imageUrl } from '../../utils/formatters';
import { SectionHeader } from '../common/SectionHeader';

interface TvCreditsProps {
  creators: TvCreator[];
  networks: TvNetwork[];
}

export function TvCredits({ creators, networks }: TvCreditsProps) {
  return (
    <>
      {creators.length > 0 ? (
        <View style={styles.group}>
          <SectionHeader title="Created by" />
          <View style={styles.creatorRow}>
            {creators.map((creator) => (
              <View key={creator.id} style={styles.creator}>
                <Image
                  accessibilityLabel={`${creator.name} profile`}
                  contentFit="cover"
                  source={{ uri: imageUrl(creator.profile_path, 'w185') }}
                  style={styles.creatorPhoto}
                />
                <Text numberOfLines={2} style={styles.creatorName}>
                  {creator.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
      {networks.length > 0 ? (
        <View style={styles.group}>
          <SectionHeader title="Networks" />
          <View style={styles.networkRow}>
            {networks.map((network) => (
              <View key={network.id} style={styles.network}>
                <Image
                  accessibilityLabel={`${network.name} logo`}
                  contentFit="contain"
                  source={{ uri: imageUrl(network.logo_path, 'w185') }}
                  style={styles.networkLogo}
                />
                <Text numberOfLines={1} style={styles.networkName}>
                  {network.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  group: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
  },
  creatorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  creator: {
    width: 78,
    alignItems: 'center',
  },
  creatorPhoto: {
    width: 64,
    height: 64,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.surfaceElevated,
  },
  creatorName: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.fontSize.caption,
    textAlign: 'center',
  },
  networkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  network: {
    width: 92,
    alignItems: 'center',
  },
  networkLogo: {
    width: 80,
    height: 48,
    borderRadius: spacing.radiusSmall,
    backgroundColor: colors.surfaceElevated,
  },
  networkName: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.fontSize.caption,
  },
});
