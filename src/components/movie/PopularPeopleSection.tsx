/** Displays popular people in a horizontally browsable, independently retryable section. */
import { FlatList, StyleSheet, View } from 'react-native';
import type { PopularPerson } from '../../api/types';
import { spacing } from '../../theme';
import { EmptyState } from '../common/EmptyState';
import { ErrorView } from '../common/ErrorView';
import { SectionHeader } from '../common/SectionHeader';
import { SkeletonCard } from '../common/SkeletonCard';
import { PersonCard } from '../person/PersonCard';

interface PopularPeopleSectionProps {
  people: PopularPerson[];
  isLoading: boolean;
  error?: string;
  onRetry: () => void;
  onOpenPerson: (personId: number) => void;
}

export function PopularPeopleSection({
  people,
  isLoading,
  error,
  onRetry,
  onOpenPerson,
}: PopularPeopleSectionProps) {
  return (
    <View style={styles.container}>
      <SectionHeader title="Popular People" />
      {error && people.length === 0 ? (
        <ErrorView message={error} onRetry={onRetry} />
      ) : isLoading ? (
        <View style={styles.skeletons}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : people.length === 0 ? (
        <EmptyState title="No popular people available" />
      ) : (
        <>
          {error ? <ErrorView message={error} onRetry={onRetry} /> : null}
          <FlatList
            data={people}
            horizontal
            initialNumToRender={4}
            keyExtractor={(person) => String(person.id)}
            maxToRenderPerBatch={4}
            renderItem={({ item }) => <PersonCard person={item} onPress={onOpenPerson} />}
            showsHorizontalScrollIndicator={false}
            windowSize={3}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
  },
  skeletons: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
