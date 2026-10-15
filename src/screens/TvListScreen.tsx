/** Browses popular and top-rated TV series with retained paginated query caches. */
import { useCallback, useState } from 'react';
import type { ListRenderItem } from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TvListItem } from '../api/types';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { MovieGrid } from '../components/movie/MovieGrid';
import { TvCard } from '../components/tv/TvCard';
import { useInfiniteTvList, type TvListCategory } from '../hooks/usePersonAndTv';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import { getUserErrorMessage } from '../utils/errors';

const TV_CATEGORIES: { label: string; value: TvListCategory }[] = [
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'topRated' },
];

export function TvListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [category, setCategory] = useState<TvListCategory>('popular');
  const popularQuery = useInfiniteTvList('popular', category === 'popular');
  const topRatedQuery = useInfiniteTvList('topRated', category === 'topRated');
  const query = category === 'popular' ? popularQuery : topRatedQuery;
  const series = query.data?.pages.flatMap((page) => page.results) ?? [];

  const openSeries = useCallback(
    (seriesId: number) => navigation.navigate('TvDetails', { seriesId }),
    [navigation],
  );
  const renderSeries = useCallback<ListRenderItem<TvListItem>>(
    ({ item }) => <TvCard series={item} onPress={openSeries} />,
    [openSeries],
  );
  const loadMore = () => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  };

  const header = (
    <View style={styles.segment}>
      {TV_CATEGORIES.map((option) => {
        const selected = option.value === category;
        return (
          <Pressable
            accessibilityLabel={`Show ${option.label} TV shows`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={option.value}
            onPress={() => setCategory(option.value)}
            style={[styles.segmentButton, selected ? styles.selectedSegment : null]}
          >
            <Text
              style={[styles.segmentText, selected ? styles.selectedSegmentText : null]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <ScreenContainer>
      <OfflineBanner />
      <MovieGrid
        emptyTitle="No TV shows available"
        emptyMessage="Try again later."
        errorMessage={
          query.error
            ? getUserErrorMessage(query.error, 'Unable to load TV shows.')
            : undefined
        }
        hasNextPage={query.hasNextPage}
        header={header}
        isFetchingNextPage={query.isFetchingNextPage}
        isLoading={query.isLoading}
        items={series}
        keyExtractor={(item) => String(item.id)}
        nextPageError={
          query.isFetchNextPageError
            ? getUserErrorMessage(query.error, 'Unable to load more TV shows.')
            : undefined
        }
        onLoadMore={loadMore}
        onRefresh={() => void query.refetch()}
        onRetry={() => void query.refetch()}
        refreshing={query.isRefetching && !query.isFetchingNextPage}
        renderItem={renderSeries}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    marginHorizontal: spacing.screenHorizontal,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.xxs,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.surface,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusPill,
  },
  selectedSegment: {
    backgroundColor: colors.accent,
  },
  segmentText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  selectedSegmentText: {
    color: colors.background,
  },
});
