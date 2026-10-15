/** Compact portrait card for popular-person discovery. */
import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { CachedImage as Image } from '../common/CachedImage';
import type { PopularPerson } from '../../api/types';
import { colors, spacing, typography } from '../../theme';
import { imageUrl } from '../../utils/formatters';

interface PersonCardProps {
  person: PopularPerson;
  onPress: (personId: number) => void;
}

function PersonCardComponent({ person, onPress }: PersonCardProps) {
  const knownFor = person.known_for
    .slice(0, 2)
    .map((title) => title.title)
    .join(', ');

  return (
    <Pressable
      accessibilityLabel={`View ${person.name}, popular ${person.known_for_department}`}
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
      <Text numberOfLines={1} style={styles.name}>
        {person.name}
      </Text>
      <Text numberOfLines={2} style={styles.knownFor}>
        {knownFor || person.known_for_department}
      </Text>
    </Pressable>
  );
}

export const PersonCard = memo(PersonCardComponent);

const styles = StyleSheet.create({
  container: {
    width: 104,
    marginRight: spacing.sm,
  },
  image: {
    width: 104,
    height: 128,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surfaceElevated,
  },
  name: {
    marginTop: spacing.xs,
    color: colors.textPrimary,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  knownFor: {
    marginTop: spacing.xxs,
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
  },
});
