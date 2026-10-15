/** Shows one season with its poster and documented air-date and episode metadata. */
import { CachedImage as Image } from '../common/CachedImage';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TvSeason } from '../../api/types';
import { colors, spacing, typography } from '../../theme';
import { formatDate, imageUrl } from '../../utils/formatters';

interface TvSeasonCardProps {
  season: TvSeason;
}

function TvSeasonCardComponent({ season }: TvSeasonCardProps) {
  return (
    <View style={styles.container}>
      <Image
        accessibilityLabel={`${season.name} poster`}
        contentFit="cover"
        source={{ uri: imageUrl(season.poster_path, 'w185') }}
        style={styles.poster}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{season.name}</Text>
        <Text style={styles.metadata}>
          {season.episode_count} {season.episode_count === 1 ? 'episode' : 'episodes'}
        </Text>
        {season.air_date ? (
          <Text style={styles.metadata}>Aired {formatDate(season.air_date)}</Text>
        ) : null}
      </View>
    </View>
  );
}

export const TvSeasonCard = memo(TvSeasonCardComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    padding: spacing.sm,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surface,
  },
  poster: {
    width: 72,
    height: 108,
    borderRadius: spacing.radiusSmall,
    backgroundColor: colors.surfaceElevated,
  },
  details: {
    flex: 1,
    gap: spacing.xs,
    marginLeft: spacing.md,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
  },
  metadata: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
  },
});
