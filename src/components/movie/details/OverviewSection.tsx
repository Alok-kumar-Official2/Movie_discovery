/** Lets users expand long synopsis text without overwhelming the detail page. */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../../theme';

interface OverviewSectionProps {
  overview: string;
}

export function OverviewSection({ overview }: OverviewSectionProps) {
  const [expanded, setExpanded] = useState(false);
  if (!overview.trim()) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Overview</Text>
      <Text numberOfLines={expanded ? undefined : 4} style={styles.body}>
        {overview}
      </Text>
      {overview.length > 240 ? (
        <Pressable
          accessibilityLabel={expanded ? 'Show less overview' : 'Read more overview'}
          accessibilityRole="button"
          onPress={() => setExpanded((current) => !current)}
        >
          <Text style={styles.action}>{expanded ? 'Read less' : 'Read more'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.xs,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.subtitle,
    fontWeight: typography.fontWeight.bold,
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
  },
  action: {
    color: colors.accent,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
});
