/** Shows saved searches before a query is entered and lets users reuse or clear them. */
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../common/EmptyState';
import { colors, spacing, typography } from '../../theme';

interface SearchRecentListProps {
  searches: string[];
  isLoading: boolean;
  storageError: string | null;
  onSelect: (query: string) => void;
  onClear: () => void;
  onRetry: () => void;
}

export function SearchRecentList({
  searches,
  isLoading,
  storageError,
  onSelect,
  onClear,
  onRetry,
}: SearchRecentListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.title}>Recent searches</Text>
        {searches.length > 0 ? (
          <Pressable
            accessibilityLabel="Clear recent searches"
            accessibilityRole="button"
            onPress={onClear}
          >
            <Text style={styles.action}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
      {storageError ? (
        <Pressable
          accessibilityLabel="Retry recent search storage"
          accessibilityRole="button"
          onPress={onRetry}
        >
          <Text style={styles.error}>{storageError} Tap to retry.</Text>
        </Pressable>
      ) : null}
      {isLoading ? (
        <Text style={styles.loading}>Loading recent searches…</Text>
      ) : searches.length === 0 ? (
        <EmptyState
          title="Start exploring"
          message="Your recent movie, TV, and people searches will appear here."
        />
      ) : (
        <FlatList
          data={searches}
          initialNumToRender={8}
          keyExtractor={(item) => item.toLocaleLowerCase()}
          maxToRenderPerBatch={8}
          renderItem={({ item }) => (
            <Pressable
              accessibilityLabel={`Search again for ${item}`}
              accessibilityRole="button"
              onPress={() => onSelect(item)}
              style={styles.item}
            >
              <Text style={styles.query}>{item}</Text>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          )}
          windowSize={3}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.subtitle,
    fontWeight: typography.fontWeight.semibold,
  },
  action: {
    color: colors.accent,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  error: {
    marginBottom: spacing.sm,
    color: colors.danger,
    fontSize: typography.fontSize.small,
  },
  loading: {
    color: colors.textMuted,
    fontSize: typography.fontSize.small,
  },
  item: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  query: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
  },
  arrow: {
    color: colors.textMuted,
    fontSize: typography.fontSize.heading,
  },
});
