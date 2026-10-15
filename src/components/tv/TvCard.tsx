/** Shows a TV poster, first-air year, and score in the shared two-column grid. */
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import type { TvListItem } from '../../api/types';
import { Rating } from '../common/Rating';
import { colors, spacing, typography } from '../../theme';
import { imageUrl } from '../../utils/formatters';

interface TvCardProps {
  series: TvListItem;
  onPress: (seriesId: number) => void;
}

function TvCardComponent({ series, onPress }: TvCardProps) {
  const releaseYear = series.first_air_date?.slice(0, 4) || 'Year unavailable';
  return (
    <Pressable
      accessibilityLabel={`Open TV show ${series.name}, rated ${series.vote_average.toFixed(1)}`}
      accessibilityRole="button"
      onPress={() => onPress(series.id)}
      style={styles.container}
    >
      <View style={styles.posterContainer}>
        <Image
          accessibilityLabel={`${series.name} poster`}
          contentFit="cover"
          source={{ uri: imageUrl(series.poster_path, 'w342') }}
          style={styles.poster}
        />
        <View style={styles.rating}>
          <Rating value={series.vote_average} />
        </View>
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {series.name}
      </Text>
      <Text style={styles.year}>{releaseYear}</Text>
    </Pressable>
  );
}

export const TvCard = memo(TvCardComponent);

const styles = StyleSheet.create({
  container: {
    width: '47%',
    marginBottom: spacing.md,
  },
  posterContainer: {
    position: 'relative',
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surfaceElevated,
  },
  rating: {
    position: 'absolute',
    right: spacing.xs,
    bottom: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSmall,
    backgroundColor: colors.background,
  },
  title: {
    marginTop: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  year: {
    marginTop: spacing.xxs,
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
  },
});
