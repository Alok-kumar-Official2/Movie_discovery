/** Presents a person's portrait and biography with graceful empty and expansion states. */
import { useState } from 'react';
import { CachedImage as Image } from '../common/CachedImage';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PersonDetailsResponse } from '../../api/types';
import { colors, spacing, typography } from '../../theme';
import { calculateAge, formatDate, imageUrl } from '../../utils/formatters';
import { SectionHeader } from '../common/SectionHeader';

interface PersonProfileProps {
  person: PersonDetailsResponse;
}

const BIOGRAPHY_PREVIEW_LENGTH = 420;

export function PersonProfile({ person }: PersonProfileProps) {
  const [isBiographyExpanded, setIsBiographyExpanded] = useState(false);
  const age = calculateAge(person.birthday);
  const biography = person.biography.trim();
  const biographyIsLong = biography.length > BIOGRAPHY_PREVIEW_LENGTH;
  const visibleBiography =
    biographyIsLong && !isBiographyExpanded
      ? `${biography.slice(0, BIOGRAPHY_PREVIEW_LENGTH).trimEnd()}…`
      : biography;

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          accessibilityLabel={`${person.name} profile photo`}
          contentFit="cover"
          source={{ uri: imageUrl(person.profile_path, 'h632') }}
          style={styles.photo}
          transition={180}
        />
        <View style={styles.identity}>
          <Text style={styles.name}>{person.name}</Text>
          {person.known_for_department ? (
            <Text style={styles.department}>{person.known_for_department}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.facts}>
        {person.birthday ? (
          <Text style={styles.fact}>
            Born {formatDate(person.birthday)}
            {age !== null ? ` · ${age} years old` : ''}
          </Text>
        ) : null}
        {person.place_of_birth ? (
          <Text style={styles.fact}>{person.place_of_birth}</Text>
        ) : null}
      </View>
      <View style={styles.biography}>
        <SectionHeader title="Biography" />
        {biography ? (
          <>
            <Text style={styles.body}>{visibleBiography}</Text>
            {biographyIsLong ? (
              <Pressable
                accessibilityLabel={
                  isBiographyExpanded ? 'Show less biography' : 'Read full biography'
                }
                accessibilityRole="button"
                onPress={() => setIsBiographyExpanded((expanded) => !expanded)}
              >
                <Text style={styles.readMore}>
                  {isBiographyExpanded ? 'Read less' : 'Read more'}
                </Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <Text style={styles.body}>No biography is available.</Text>
        )}
      </View>
      <View style={styles.filmographyHeading}>
        <SectionHeader title="Filmography" />
        <Text style={styles.hint}>Newest first</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.md,
  },
  photo: {
    width: 112,
    height: 150,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surfaceElevated,
  },
  identity: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
  },
  department: {
    color: colors.accent,
    fontSize: typography.fontSize.small,
  },
  facts: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  fact: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
  },
  biography: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
  },
  readMore: {
    marginTop: spacing.xs,
    color: colors.accent,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
  filmographyHeading: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
  },
  hint: {
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.fontSize.caption,
  },
});
