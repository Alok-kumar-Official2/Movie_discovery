/** Loads TV metadata and renders its documented seasons in a virtualized list. */
import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import type { ListRenderItem } from 'react-native';
import type { TvSeason } from '../api/types';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorView } from '../components/common/ErrorView';
import { Loader } from '../components/common/Loader';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { TvOverview } from '../components/tv/TvOverview';
import { TvSeasonCard } from '../components/tv/TvSeasonCard';
import { useTvDetails } from '../hooks/usePersonAndTv';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, spacing } from '../theme';
import { getUserErrorMessage } from '../utils/errors';

export function TvDetailsScreen({ route }: RootStackScreenProps<'TvDetails'>) {
  const { seriesId } = route.params;
  const seriesQuery = useTvDetails(seriesId);
  const renderSeason = useCallback<ListRenderItem<TvSeason>>(
    ({ item }) => <TvSeasonCard season={item} />,
    [],
  );

  if (seriesQuery.isLoading) {
    return (
      <ScreenContainer style={styles.centered}>
        <OfflineBanner />
        <Loader label="Loading TV details" />
      </ScreenContainer>
    );
  }

  if (seriesQuery.error && !seriesQuery.data) {
    return (
      <ScreenContainer style={styles.centered}>
        <OfflineBanner />
        <ErrorView
          message={getUserErrorMessage(
            seriesQuery.error,
            'Unable to load this TV show. Please try again.',
          )}
          onRetry={() => void seriesQuery.refetch()}
        />
      </ScreenContainer>
    );
  }

  if (!seriesQuery.data) {
    return (
      <ScreenContainer style={styles.centered}>
        <OfflineBanner />
        <EmptyState title="TV show unavailable" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['left', 'right']}>
      <OfflineBanner />
      <FlatList
        contentContainerStyle={styles.list}
        data={seriesQuery.data.seasons}
        initialNumToRender={6}
        keyExtractor={(season) => `${seriesId}-${season.id}`}
        ListEmptyComponent={<EmptyState title="No seasons listed" />}
        ListHeaderComponent={
          <>
            <TvOverview series={seriesQuery.data} />
            {seriesQuery.error ? (
              <ErrorView
                message={getUserErrorMessage(
                  seriesQuery.error,
                  'Unable to refresh this TV show.',
                )}
                onRetry={() => void seriesQuery.refetch()}
              />
            ) : null}
          </>
        }
        maxToRenderPerBatch={8}
        refreshControl={
          <RefreshControl
            colors={[colors.accent]}
            onRefresh={() => void seriesQuery.refetch()}
            refreshing={seriesQuery.isRefetching}
            tintColor={colors.accent}
          />
        }
        renderItem={renderSeason}
        showsVerticalScrollIndicator={false}
        windowSize={7}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  list: {
    paddingBottom: spacing.xl,
  },
});
