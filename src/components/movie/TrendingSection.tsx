/** Owns the trending range selector and its independent hero query states. */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { EmptyState } from '../common/EmptyState';
import { ErrorView } from '../common/ErrorView';
import { HeroBanner } from './HeroBanner';
import type { TrendingTimeWindow } from '../../api/types';
import { useTrendingMovies } from '../../hooks/useMovieLists';
import { colors, spacing, typography } from '../../theme';
import { HERO_BANNER_HEIGHT } from '../../utils/constants';
import { getUserErrorMessage } from '../../utils/errors';

interface TrendingSectionProps {
  onMoviePress: (movieId: number) => void;
}

function TrendingSkeleton({ width }: { width: number }) {
  return <View style={[styles.heroSkeleton, { width }]} />;
}

export function TrendingSection({ onMoviePress }: TrendingSectionProps) {
  const { width } = useWindowDimensions();
  const [timeWindow, setTimeWindow] = useState<TrendingTimeWindow>('day');
  const trendingQuery = useTrendingMovies(timeWindow);

  return (
    <>
      <View style={styles.heading}>
        <Text style={styles.pageTitle}>Discover</Text>
        <View style={styles.toggle} accessibilityLabel="Trending time range">
          {(['day', 'week'] as const).map((option) => (
            <Pressable
              key={option}
              accessibilityLabel={`Trending ${option}`}
              accessibilityRole="button"
              accessibilityState={{ selected: timeWindow === option }}
              onPress={() => setTimeWindow(option)}
              style={[
                styles.toggleOption,
                timeWindow === option ? styles.selectedToggle : null,
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  timeWindow === option ? styles.selectedToggleText : null,
                ]}
              >
                {option === 'day' ? 'Today' : 'This week'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      {trendingQuery.isLoading && !trendingQuery.data ? (
        <TrendingSkeleton width={width} />
      ) : trendingQuery.error && !trendingQuery.data?.results.length ? (
        <View style={styles.heroState}>
          <ErrorView
            message={getUserErrorMessage(
              trendingQuery.error,
              'Unable to load trending movies. Please try again.',
            )}
            onRetry={() => void trendingQuery.refetch()}
          />
        </View>
      ) : !trendingQuery.data?.results.length ? (
        <View style={styles.heroState}>
          <EmptyState
            title="No trending movies"
            message="Trending titles are not available right now."
          />
        </View>
      ) : (
        <>
          {trendingQuery.error ? (
            <View style={styles.heroState}>
              <ErrorView
                message={getUserErrorMessage(
                  trendingQuery.error,
                  'Unable to refresh trending movies.',
                )}
                onRetry={() => void trendingQuery.refetch()}
              />
            </View>
          ) : null}
          <HeroBanner
            key={timeWindow}
            movies={trendingQuery.data.results.slice(0, 8)}
            onMoviePress={onMoviePress}
          />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    minHeight: 70,
    paddingHorizontal: spacing.screenHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
  },
  toggle: {
    flexDirection: 'row',
    padding: spacing.xxs,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.surface,
  },
  toggleOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusPill,
  },
  selectedToggle: {
    backgroundColor: colors.surfaceElevated,
  },
  toggleText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
  },
  selectedToggleText: {
    color: colors.accent,
    fontWeight: typography.fontWeight.semibold,
  },
  heroSkeleton: {
    height: HERO_BANNER_HEIGHT,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceElevated,
  },
  heroState: {
    minHeight: HERO_BANNER_HEIGHT,
    justifyContent: 'center',
  },
});
