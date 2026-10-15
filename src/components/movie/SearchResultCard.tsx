/** Routes a multi-search result by its TMDB media type. */
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import type { MultiSearchItem } from '../../api/types';
import { colors, spacing, typography } from '../../theme';
import { imageUrl } from '../../utils/formatters';

interface SearchResultCardProps {
  result: MultiSearchItem;
  onPress: (result: MultiSearchItem) => void;
}

function SearchResultCardComponent({ result, onPress }: SearchResultCardProps) {
  const title = result.media_type === 'movie' ? result.title : result.name;
  const imagePath =
    result.media_type === 'person' ? result.profile_path : result.poster_path;
  const descriptor =
    result.media_type === 'movie'
      ? result.release_date?.slice(0, 4) || 'Movie'
      : result.media_type === 'tv'
        ? result.first_air_date?.slice(0, 4) || 'TV show'
        : result.known_for_department || 'Person';

  return (
    <Pressable
      accessibilityLabel={`Open ${result.media_type} ${title}`}
      accessibilityRole="button"
      onPress={() => onPress(result)}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image
          accessibilityLabel={`${title} ${result.media_type} image`}
          contentFit="cover"
          source={{
            uri: imageUrl(imagePath, result.media_type === 'person' ? 'w185' : 'w342'),
          }}
          style={styles.image}
        />
        <Text style={styles.badge}>{result.media_type.toUpperCase()}</Text>
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
      <Text style={styles.descriptor}>{descriptor}</Text>
    </Pressable>
  );
}

export const SearchResultCard = memo(SearchResultCardComponent);

const styles = StyleSheet.create({
  container: {
    width: '47%',
    marginBottom: spacing.md,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surfaceElevated,
  },
  badge: {
    position: 'absolute',
    left: spacing.xs,
    bottom: spacing.xs,
    overflow: 'hidden',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSmall,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  title: {
    marginTop: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  descriptor: {
    marginTop: spacing.xxs,
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
  },
});
