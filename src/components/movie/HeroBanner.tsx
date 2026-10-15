/** Swipeable trending feature that links the selected title to its details. */
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
  useWindowDimensions,
} from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import { Rating } from '../common/Rating';
import type { MovieListItem } from '../../api/types';
import { colors, spacing, typography } from '../../theme';
import { imageUrl } from '../../utils/formatters';
import { HERO_BANNER_HEIGHT } from '../../utils/constants';

interface HeroBannerProps {
  movies: MovieListItem[];
  onMoviePress: (movieId: number) => void;
}

interface HeroPageProps {
  movie: MovieListItem;
  width: number;
  onMoviePress: (movieId: number) => void;
}

function HeroPage({ movie, width, onMoviePress }: HeroPageProps) {
  return (
    <View style={[styles.page, { width }]}>
      <Image
        accessibilityLabel={`${movie.title} featured backdrop`}
        contentFit="cover"
        source={{ uri: imageUrl(movie.backdrop_path ?? movie.poster_path, 'w780') }}
        style={StyleSheet.absoluteFill}
        transition={250}
      />
      <View style={styles.scrim} />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>TRENDING NOW</Text>
        <Text numberOfLines={2} style={styles.title}>
          {movie.title}
        </Text>
        <Rating value={movie.vote_average} />
        <Pressable
          accessibilityLabel={`View details for ${movie.title}`}
          accessibilityRole="button"
          onPress={() => onMoviePress(movie.id)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Uses page snapping so the featured movie can change by swipe without extra packages. */
export function HeroBanner({ movies, onMoviePress }: HeroBannerProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 60 }), []);
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const index = viewableItems[0]?.index;
      if (index !== null && index !== undefined) {
        setActiveIndex(index);
      }
    },
    [],
  );

  const renderItem = useCallback<ListRenderItem<MovieListItem>>(
    ({ item }) => (
      <HeroPage movie={item} width={screenWidth} onMoviePress={onMoviePress} />
    ),
    [onMoviePress, screenWidth],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        horizontal
        initialNumToRender={1}
        keyExtractor={(movie) => String(movie.id)}
        maxToRenderPerBatch={2}
        onViewableItemsChanged={onViewableItemsChanged}
        pagingEnabled
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
        windowSize={2}
      />
      {movies.length > 1 ? (
        <View style={styles.pagination} accessibilityLabel="Featured movie page">
          {movies.map((movie, index) => (
            <View
              key={movie.id}
              style={[styles.dot, index === activeIndex ? styles.activeDot : null]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HERO_BANNER_HEIGHT,
    marginBottom: spacing.lg,
  },
  page: {
    height: HERO_BANNER_HEIGHT,
    justifyContent: 'flex-end',
    backgroundColor: colors.surfaceElevated,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
  title: {
    maxWidth: '90%',
    color: colors.textPrimary,
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.display,
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.background,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.bold,
  },
  pagination: {
    position: 'absolute',
    right: spacing.screenHorizontal,
    bottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: spacing.xs,
    height: spacing.xs,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.textMuted,
  },
  activeDot: {
    width: spacing.md,
    backgroundColor: colors.accent,
  },
});
