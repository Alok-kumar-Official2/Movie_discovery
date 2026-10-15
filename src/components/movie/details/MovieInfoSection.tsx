/** Displays only populated production facts from the movie details response. */
import { StyleSheet, Text, View } from 'react-native';
import type { MovieDetailsResponse } from '../../../api/types';
import { colors, spacing, typography } from '../../../theme';
import { formatCurrency } from '../../../utils/formatters';
import { DetailSection } from './DetailSection';

interface MovieInfoSectionProps {
  movie: MovieDetailsResponse;
}

export function MovieInfoSection({ movie }: MovieInfoSectionProps) {
  const facts = [
    { label: 'Status', value: movie.status },
    { label: 'Budget', value: formatCurrency(movie.budget) },
    { label: 'Revenue', value: formatCurrency(movie.revenue) },
    { label: 'Original language', value: movie.original_language?.toUpperCase() },
  ].filter((fact) => Boolean(fact.value) && fact.value !== 'Unavailable');

  return (
    <DetailSection title="Movie Info" isLoading={false} isEmpty={facts.length === 0}>
      <View style={styles.container}>
        {facts.map((fact) => (
          <View key={fact.label} style={styles.row}>
            <Text style={styles.label}>{fact.label}</Text>
            <Text style={styles.value}>{fact.value}</Text>
          </View>
        ))}
      </View>
    </DetailSection>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.screenHorizontal,
    padding: spacing.md,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.fontSize.small,
  },
  value: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },
});
