/** Shared independent loading/error/empty boundary for movie detail sections. */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { EmptyState } from '../../common/EmptyState';
import { ErrorView } from '../../common/ErrorView';
import { SectionHeader } from '../../common/SectionHeader';
import { SkeletonCard } from '../../common/SkeletonCard';
import { spacing } from '../../../theme';

interface DetailSectionProps {
  title: string;
  isLoading: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  hasData?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
}

export function DetailSection({
  title,
  isLoading,
  errorMessage,
  onRetry,
  hasData = false,
  isEmpty = false,
  emptyMessage = 'No information is available for this section.',
  children,
}: DetailSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} />
      {isLoading && !hasData ? (
        <View style={styles.skeletonRow}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : errorMessage && onRetry && (!hasData || isEmpty) ? (
        <ErrorView message={errorMessage} onRetry={onRetry} />
      ) : isEmpty ? (
        <EmptyState title={`No ${title.toLowerCase()}`} message={emptyMessage} />
      ) : (
        <>
          {children}
          {errorMessage && onRetry ? (
            <ErrorView message={errorMessage} onRetry={onRetry} />
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
  },
  skeletonRow: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
