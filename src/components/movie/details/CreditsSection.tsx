/** Shows the movie director and a horizontally browsable cast list. */
import { useCallback } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { MovieCreditsResponse, CastMember, CrewMember } from '../../../api/types';
import { colors, spacing, typography } from '../../../theme';
import { CastCard } from '../../person/CastCard';
import { DetailSection } from './DetailSection';

interface CreditsSectionProps {
  credits?: MovieCreditsResponse;
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onPersonPress: (personId: number) => void;
}

export function CreditsSection({
  credits,
  isLoading,
  errorMessage,
  onRetry,
  onPersonPress,
}: CreditsSectionProps) {
  const renderCast = useCallback<ListRenderItem<CastMember>>(
    ({ item }) => (
      <CastCard person={item} subtitle={item.character} onPress={onPersonPress} />
    ),
    [onPersonPress],
  );
  const director = credits?.crew.find((member) => member.job === 'Director');
  const cast = credits?.cast.slice(0, 12) ?? [];

  return (
    <DetailSection
      title="Cast & Crew"
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={onRetry}
      hasData={Boolean(credits)}
      isEmpty={!director && cast.length === 0}
    >
      <View>
        {director ? <DirectorRow director={director} onPress={onPersonPress} /> : null}
        {cast.length ? (
          <FlatList
            contentContainerStyle={styles.castList}
            data={cast}
            horizontal
            initialNumToRender={5}
            keyExtractor={(person) => `${person.id}-${person.cast_id}`}
            maxToRenderPerBatch={5}
            renderItem={renderCast}
            showsHorizontalScrollIndicator={false}
            windowSize={3}
          />
        ) : null}
      </View>
    </DetailSection>
  );
}

function DirectorRow({
  director,
  onPress,
}: {
  director: CrewMember;
  onPress: (personId: number) => void;
}) {
  return (
    <View style={styles.director}>
      <Text style={styles.directorLabel}>DIRECTED BY</Text>
      <Pressable
        accessibilityLabel={`View director ${director.name}`}
        accessibilityRole="button"
        onPress={() => onPress(director.id)}
      >
        <Text style={styles.directorName}>{director.name}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  director: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },
  directorLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  directorName: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  castList: {
    paddingLeft: spacing.screenHorizontal,
  },
});
