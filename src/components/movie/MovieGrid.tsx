/** Shared two-column list with consistent skeleton, error, empty, and pagination states. */
import type { ReactNode } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { colors, spacing } from '../../theme';
import { EmptyState } from '../common/EmptyState';
import { ErrorView } from '../common/ErrorView';
import { SkeletonCard } from '../common/SkeletonCard';

interface MovieGridProps<TItem> {
  items: TItem[];
  keyExtractor: (item: TItem) => string;
  renderItem: ListRenderItem<TItem>;
  isLoading: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  emptyTitle: string;
  emptyMessage?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  nextPageError?: string;
  onLoadMore?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  header?: ReactNode;
}

const SKELETON_KEYS = ['1', '2', '3', '4', '5', '6'] as const;

export function MovieGrid<TItem>({
  items,
  keyExtractor,
  renderItem,
  isLoading,
  errorMessage,
  onRetry,
  emptyTitle,
  emptyMessage,
  hasNextPage = false,
  isFetchingNextPage = false,
  nextPageError,
  onLoadMore,
  refreshing = false,
  onRefresh,
  header,
}: MovieGridProps<TItem>) {
  if (isLoading) {
    if (header) {
      return (
        <ScrollView contentContainerStyle={styles.loadingContent}>
          {header}
          <View style={styles.loadingGrid}>
            {SKELETON_KEYS.map((key) => (
              <View key={key} style={styles.card}>
                <SkeletonCard variant="grid" />
              </View>
            ))}
          </View>
        </ScrollView>
      );
    }

    return (
      <View style={styles.loadingGrid}>
        {SKELETON_KEYS.map((key) => (
          <View key={key} style={styles.card}>
            <SkeletonCard variant="grid" />
          </View>
        ))}
      </View>
    );
  }

  if (errorMessage && items.length === 0 && onRetry) {
    if (header) {
      return (
        <ScrollView contentContainerStyle={styles.loadingContent}>
          {header}
          <ErrorView message={errorMessage} onRetry={onRetry} />
        </ScrollView>
      );
    }
    return <ErrorView message={errorMessage} onRetry={onRetry} />;
  }

  // Keep numColumns identical in empty and populated lists; React Native forbids changing it in place.
  if (items.length === 0 && header) {
    return (
      <FlatList
        contentContainerStyle={[styles.list, styles.emptyList]}
        data={[]}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<EmptyState title={emptyTitle} message={emptyMessage} />}
        ListHeaderComponent={
          header || (errorMessage && onRetry) ? (
            <View>
              {header ? <View>{header}</View> : null}
              {errorMessage && onRetry ? (
                <ErrorView message={errorMessage} onRetry={onRetry} />
              ) : null}
            </View>
          ) : null
        }
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        numColumns={2}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        windowSize={7}
      />
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <EmptyState title={emptyTitle} message={emptyMessage} />
      </View>
    );
  }

  return (
    <FlatList
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      data={items}
      initialNumToRender={6}
      keyExtractor={keyExtractor}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        header || (errorMessage && onRetry) ? (
          <View>
            {header ? <View>{header}</View> : null}
            {errorMessage && onRetry ? (
              <ErrorView message={errorMessage} onRetry={onRetry} />
            ) : null}
          </View>
        ) : null
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <View style={styles.card}>
              <SkeletonCard variant="grid" />
            </View>
            <View style={styles.card}>
              <SkeletonCard variant="grid" />
            </View>
          </View>
        ) : nextPageError && onLoadMore ? (
          <ErrorView message={nextPageError} onRetry={onLoadMore} />
        ) : null
      }
      maxToRenderPerBatch={8}
      numColumns={2}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          onLoadMore?.();
        }
      }}
      onEndReachedThreshold={0.5}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            colors={[colors.accent]}
            onRefresh={onRefresh}
            refreshing={refreshing}
            tintColor={colors.accent}
          />
        ) : undefined
      }
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      windowSize={7}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xl,
  },
  emptyList: {
    flexGrow: 1,
  },
  loadingContent: {
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  loadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
  },
  card: {
    width: '47%',
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  empty: {
    flex: 1,
  },
});
