/** Groups India streaming providers by subscription, rental, and purchase. */
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../common/EmptyState';
import type { MovieWatchProvidersResponse, WatchProvider } from '../../../api/types';
import { colors, spacing, typography } from '../../../theme';
import { DEFAULT_REGION } from '../../../utils/constants';
import { ProviderLogo } from '../ProviderLogo';
import { DetailSection } from './DetailSection';

interface ProvidersSectionProps {
  providers?: MovieWatchProvidersResponse;
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

const PROVIDER_GROUPS = [
  { key: 'flatrate', title: 'Stream' },
  { key: 'rent', title: 'Rent' },
  { key: 'buy', title: 'Buy' },
] as const;

export function ProvidersSection({
  providers,
  isLoading,
  errorMessage,
  onRetry,
}: ProvidersSectionProps) {
  const regionProviders = providers?.results[DEFAULT_REGION];
  const hasProviders = PROVIDER_GROUPS.some(
    ({ key }) => (regionProviders?.[key]?.length ?? 0) > 0,
  );

  return (
    <DetailSection
      title="Where to Watch · India"
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={onRetry}
      hasData={Boolean(providers)}
    >
      <View style={styles.content}>
        {hasProviders ? (
          PROVIDER_GROUPS.map(({ key, title }) => {
            const items = regionProviders?.[key] ?? [];
            return items.length ? (
              <ProviderGroup key={key} title={title} providers={items} />
            ) : null;
          })
        ) : (
          <EmptyState
            title="No providers in India"
            message="This title is not currently listed with streaming providers in India."
          />
        )}
        <Text style={styles.attribution}>
          Streaming availability provided by JustWatch. This product uses the TMDB API but
          is not endorsed or certified by TMDB.
        </Text>
      </View>
    </DetailSection>
  );
}

function ProviderGroup({
  title,
  providers,
}: {
  title: string;
  providers: WatchProvider[];
}) {
  const renderProvider: ListRenderItem<WatchProvider> = ({ item }) => (
    <ProviderLogo provider={item} />
  );

  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <FlatList
        data={providers}
        horizontal
        initialNumToRender={4}
        keyExtractor={(provider) => String(provider.provider_id)}
        maxToRenderPerBatch={4}
        renderItem={renderProvider}
        showsHorizontalScrollIndicator={false}
        windowSize={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
  },
  group: {
    gap: spacing.sm,
  },
  groupTitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  attribution: {
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
    lineHeight: 18,
  },
});
