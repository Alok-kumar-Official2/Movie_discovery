/** Expandable review with TMDB avatar URL normalization and optional rating. */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import type { MovieReview } from '../../api/types';
import { colors, spacing, typography } from '../../theme';
import { formatRating, imageUrl } from '../../utils/formatters';

interface ReviewCardProps {
  review: MovieReview;
}

/** TMDB review avatars may contain a URL prefixed with a slash instead of an image path. */
function avatarUrl(path: string | null): string {
  if (path?.startsWith('/http')) {
    return path.slice(1);
  }
  return imageUrl(path, 'w92');
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const author = review.author_details.name || review.author;
  const rating = formatRating(review.author_details.rating);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          accessibilityLabel={`${author} avatar`}
          contentFit="cover"
          source={{ uri: avatarUrl(review.author_details.avatar_path) }}
          style={styles.avatar}
        />
        <View style={styles.authorInfo}>
          <Text numberOfLines={1} style={styles.author}>
            {author}
          </Text>
          {rating !== 'NR' ? <Text style={styles.rating}>★ {rating}</Text> : null}
        </View>
      </View>
      <Text numberOfLines={expanded ? undefined : 5} style={styles.content}>
        {review.content}
      </Text>
      {review.content.length > 360 ? (
        <Pressable
          accessibilityLabel={expanded ? 'Collapse review' : 'Expand review'}
          accessibilityRole="button"
          onPress={() => setExpanded((current) => !current)}
        >
          <Text style={styles.action}>{expanded ? 'Read less' : 'Read more'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.surfaceElevated,
  },
  authorInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  author: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  rating: {
    color: colors.accent,
    fontSize: typography.fontSize.caption,
  },
  content: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
    lineHeight: 21,
  },
  action: {
    marginTop: spacing.xs,
    color: colors.accent,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.semibold,
  },
});
