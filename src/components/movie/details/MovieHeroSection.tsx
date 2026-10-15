/** Displays title identity and movie actions over its cinematic backdrop. */
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CachedImage as Image } from '../../common/CachedImage';
import { GenreChip } from '../../common/GenreChip';
import { Rating } from '../../common/Rating';
import type { MovieDetailsResponse } from '../../../api/types';
import { colors, spacing, typography } from '../../../theme';
import { formatDate, formatRuntime, imageUrl } from '../../../utils/formatters';
import { HERO_BANNER_HEIGHT } from '../../../utils/constants';
import { MovieActions } from './MovieActions';

interface MovieHeroSectionProps {
  movie: MovieDetailsResponse;
  isWatchlisted: boolean;
  hasTrailer: boolean;
  onToggleWatchlist: () => void;
  onPlayTrailer: () => void;
}

export function MovieHeroSection({
  movie,
  isWatchlisted,
  hasTrailer,
  onToggleWatchlist,
  onPlayTrailer,
}: MovieHeroSectionProps) {
  const { width } = useWindowDimensions();
  const releaseYear = movie.release_date?.slice(0, 4);

  return (
    <View>
      <View style={[styles.backdrop, { width }]}>
        <Image
          accessibilityLabel={`${movie.title} backdrop`}
          contentFit="cover"
          source={{ uri: imageUrl(movie.backdrop_path, 'w780') }}
          style={StyleSheet.absoluteFill}
          transition={250}
        />
        <View style={styles.scrim} />
      </View>
      <View style={styles.details}>
        <Image
          accessibilityLabel={`${movie.title} poster`}
          contentFit="cover"
          source={{ uri: imageUrl(movie.poster_path, 'w342') }}
          style={styles.poster}
        />
        <View style={styles.titleColumn}>
          <Text style={styles.title}>{movie.title}</Text>
          {movie.tagline ? <Text style={styles.tagline}>{movie.tagline}</Text> : null}
          <View style={styles.metadata}>
            {releaseYear ? <Text style={styles.metadataText}>{releaseYear}</Text> : null}
            {movie.runtime ? (
              <Text style={styles.metadataText}>{formatRuntime(movie.runtime)}</Text>
            ) : null}
            <Rating value={movie.vote_average} />
          </View>
        </View>
      </View>
      <View style={styles.genres}>
        {movie.genres.map((genre) => (
          <GenreChip key={genre.id} label={genre.name} />
        ))}
      </View>
      <MovieActions
        isWatchlisted={isWatchlisted}
        hasTrailer={hasTrailer}
        onToggleWatchlist={onToggleWatchlist}
        onPlayTrailer={onPlayTrailer}
      />
      {movie.release_date ? (
        <Text style={styles.releaseDate}>Released {formatDate(movie.release_date)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    height: HERO_BANNER_HEIGHT * 0.7,
    backgroundColor: colors.surfaceElevated,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.screenHorizontal,
    marginTop: -80,
  },
  poster: {
    width: 112,
    height: 168,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surfaceElevated,
  },
  titleColumn: {
    flex: 1,
    marginLeft: spacing.md,
    paddingBottom: spacing.xs,
    gap: spacing.xs,
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
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metadataText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.caption,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.screenHorizontal,
    marginTop: spacing.md,
  },
  releaseDate: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
  },
});
