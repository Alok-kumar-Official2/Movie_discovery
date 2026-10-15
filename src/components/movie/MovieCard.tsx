/** Poster card used by horizontal carousels and the See All grid. */
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import { Ionicons } from '@expo/vector-icons';
import { Rating } from '../common/Rating';
import { colors, spacing, typography } from '../../theme';
import { imageUrl } from '../../utils/formatters';
import type { MovieCardData } from '../../api/types';
import { useWatchlist } from '../../context/WatchlistContext';
import { MOVIE_CAROUSEL_CARD_WIDTH } from '../../utils/constants';

interface MovieCardProps {
  movie: MovieCardData;
  onPress: (movieId: number) => void;
  variant?: 'carousel' | 'grid';
}

function MovieCardComponent({ movie, onPress, variant = 'carousel' }: MovieCardProps) {
  const releaseYear = movie.release_date?.slice(0, 4) || 'Year unavailable';
  const isGrid = variant === 'grid';
  const { add, remove, isInWatchlist } = useWatchlist();
  const isSaved = isInWatchlist(movie.id);

  const toggleWatchlist = () => {
    void (isSaved ? remove(movie.id) : add(movie));
  };

  return (
    <Pressable
      accessibilityLabel={`Open ${movie.title}, rated ${
        movie.vote_average?.toFixed(1) ?? 'not rated'
      }`}
      accessibilityRole="button"
      onPress={() => onPress(movie.id)}
      style={[styles.container, isGrid ? styles.gridContainer : null]}
    >
      <View style={styles.posterContainer}>
        <Image
          accessibilityLabel={`${movie.title} poster`}
          contentFit="cover"
          source={{ uri: imageUrl(movie.poster_path, 'w342') }}
          style={styles.poster}
          transition={180}
        />
        <View style={styles.rating}>
          <Rating value={movie.vote_average} />
        </View>
        <Pressable
          accessibilityLabel={
            isSaved
              ? `Remove ${movie.title} from watchlist`
              : `Add ${movie.title} to watchlist`
          }
          accessibilityRole="button"
          accessibilityState={{ selected: isSaved }}
          hitSlop={8}
          onPress={(event) => {
            event.stopPropagation();
            toggleWatchlist();
          }}
          style={styles.watchlistButton}
        >
          <Ionicons
            color={isSaved ? colors.danger : colors.textPrimary}
            name={isSaved ? 'heart' : 'heart-outline'}
            size={18}
          />
        </Pressable>
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {movie.title}
      </Text>
      <Text style={styles.year}>{releaseYear}</Text>
    </Pressable>
  );
}

export const MovieCard = memo(MovieCardComponent);

const styles = StyleSheet.create({
  container: {
    width: MOVIE_CAROUSEL_CARD_WIDTH,
    marginRight: spacing.sm,
  },
  gridContainer: {
    width: '47%',
    marginRight: 0,
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
    borderRadius: spacing.radiusSmall,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    backgroundColor: colors.background,
  },
  watchlistButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.overlay,
  },
  title: {
    marginTop: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 19,
  },
  year: {
    marginTop: spacing.xxs,
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
  },
});
