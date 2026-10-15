/** Renders the TV backdrop, core metadata, genres, creators, and network logos. */
import { CachedImage as Image } from '../common/CachedImage';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { TvDetailsResponse } from '../../api/types';
import { colors, spacing, typography } from '../../theme';
import { formatDate, imageUrl } from '../../utils/formatters';
import { SectionHeader } from '../common/SectionHeader';
import { GenreChip } from '../common/GenreChip';
import { TvCredits } from './TvCredits';

interface TvOverviewProps {
  series: TvDetailsResponse;
}

export function TvOverview({ series }: TvOverviewProps) {
  const { width } = useWindowDimensions();
  const firstAirDate = series.first_air_date ? formatDate(series.first_air_date) : null;

  return (
    <View>
      <View style={[styles.backdrop, { width }]}>
        <Image
          accessibilityLabel={`${series.name} backdrop`}
          contentFit="cover"
          source={{ uri: imageUrl(series.backdrop_path, 'w780') }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.scrim} />
      </View>
      <View style={styles.identity}>
        <Image
          accessibilityLabel={`${series.name} poster`}
          contentFit="cover"
          source={{ uri: imageUrl(series.poster_path, 'w342') }}
          style={styles.poster}
        />
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{series.name}</Text>
          {series.tagline ? <Text style={styles.tagline}>{series.tagline}</Text> : null}
          {firstAirDate ? (
            <Text style={styles.date}>First aired {firstAirDate}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.metadata}>
        <Text style={styles.stat}>{series.status || 'Status unavailable'}</Text>
        <Text style={styles.stat}>
          {series.number_of_seasons}{' '}
          {series.number_of_seasons === 1 ? 'season' : 'seasons'}
        </Text>
        <Text style={styles.stat}>
          {series.number_of_episodes}{' '}
          {series.number_of_episodes === 1 ? 'episode' : 'episodes'}
        </Text>
      </View>
      {series.genres.length > 0 ? (
        <View style={styles.genres}>
          {series.genres.map((genre) => (
            <GenreChip key={genre.id} label={genre.name} />
          ))}
        </View>
      ) : null}
      {series.overview ? <Text style={styles.overview}>{series.overview}</Text> : null}
      <TvCredits creators={series.created_by} networks={series.networks} />
      <View style={styles.seasonsHeading}>
        <SectionHeader title="Seasons" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    height: 220,
    backgroundColor: colors.surfaceElevated,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: -78,
    paddingHorizontal: spacing.screenHorizontal,
  },
  poster: {
    width: 108,
    height: 162,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surfaceElevated,
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xs,
    marginLeft: spacing.md,
    paddingBottom: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
    fontStyle: 'italic',
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
  },
  stat: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
  },
  overview: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
  },
  seasonsHeading: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
  },
});
