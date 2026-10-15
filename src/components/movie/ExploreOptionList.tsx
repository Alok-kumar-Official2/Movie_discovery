/** Renders one accessible set of mutually exclusive Explore filter options. */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export interface ExploreOption {
  label: string;
  value: string;
}

export const SORT_OPTIONS: ExploreOption[] = [
  { label: 'Popular', value: 'popularity.desc' },
  { label: 'Top rated', value: 'vote_average.desc' },
  { label: 'Newest', value: 'primary_release_date.desc' },
  { label: 'Revenue', value: 'revenue.desc' },
];

export const RATING_OPTIONS: ExploreOption[] = [
  { label: 'Any', value: '' },
  { label: '6+', value: '6' },
  { label: '7+', value: '7' },
  { label: '8+', value: '8' },
];

interface ExploreOptionListProps {
  title: string;
  options: ExploreOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  compact?: boolean;
}

export function ExploreOptionList({
  title,
  options,
  selectedValue,
  onSelect,
  compact = false,
}: ExploreOptionListProps) {
  return (
    <View>
      <Text style={[styles.heading, compact ? styles.compactHeading : null]}>
        {title}
      </Text>
      <View style={styles.optionRow}>
        {options.map((option) => {
          const selected = selectedValue === option.value;
          return (
            <Pressable
              accessibilityLabel={`${selected ? 'Selected' : 'Select'} ${option.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={option.value || option.label}
              onPress={() => onSelect(option.value)}
              style={[styles.option, selected ? styles.selectedOption : null]}
            >
              <Text style={[styles.optionText, selected ? styles.selectedText : null]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.fontSize.subtitle,
    fontWeight: typography.fontWeight.semibold,
  },
  compactHeading: {
    marginTop: 0,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  option: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.surface,
  },
  selectedOption: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  optionText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.caption,
  },
  selectedText: {
    color: colors.background,
    fontWeight: typography.fontWeight.semibold,
  },
});
