/** Compact cast portrait linking movie credits to a person detail route. */
import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import { colors, spacing, typography } from '../../theme';
import { imageUrl } from '../../utils/formatters';
import type { CastMember, CrewMember } from '../../api/types';

type CreditPerson = CastMember | CrewMember;

interface CastCardProps {
  person: CreditPerson;
  subtitle: string;
  onPress: (personId: number) => void;
}

function CastCardComponent({ person, subtitle, onPress }: CastCardProps) {
  return (
    <Pressable
      accessibilityLabel={`View ${person.name}, ${subtitle}`}
      accessibilityRole="button"
      onPress={() => onPress(person.id)}
      style={styles.container}
    >
      <Image
        accessibilityLabel={`${person.name} profile`}
        contentFit="cover"
        source={{ uri: imageUrl(person.profile_path, 'w185') }}
        style={styles.image}
      />
      <Text numberOfLines={2} style={styles.name}>
        {person.name}
      </Text>
      <Text numberOfLines={2} style={styles.subtitle}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

export const CastCard = memo(CastCardComponent);

const styles = StyleSheet.create({
  container: {
    width: 112,
    marginRight: spacing.sm,
  },
  image: {
    width: 112,
    height: 140,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surfaceElevated,
  },
  name: {
    marginTop: spacing.xs,
    color: colors.textPrimary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  subtitle: {
    marginTop: spacing.xxs,
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
  },
});
