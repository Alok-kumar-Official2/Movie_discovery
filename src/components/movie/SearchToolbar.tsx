/** Search input and media-scope controls shared by the Search tab. */
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface SearchToolbarProps {
  value: string;
  moviesOnly: boolean;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onModeChange: (moviesOnly: boolean) => void;
}

export function SearchToolbar({
  value,
  moviesOnly,
  onChangeText,
  onSubmit,
  onClear,
  onModeChange,
}: SearchToolbarProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.inputContainer}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          accessibilityLabel="Search movies, TV shows, and people"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder="Search movies, TV, people..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          style={styles.input}
          value={value}
        />
        {value.length > 0 ? (
          <Pressable
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            onPress={onClear}
            style={styles.clearInput}
          >
            <Text style={styles.clearText}>×</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.toggleRow}>
        <ModeButton
          label="All"
          selected={!moviesOnly}
          onPress={() => onModeChange(false)}
        />
        <ModeButton
          label="Movies only"
          selected={moviesOnly}
          onPress={() => onModeChange(true)}
        />
      </View>
    </View>
  );
}

interface ModeButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function ModeButton({ label, selected, onPress }: ModeButtonProps) {
  return (
    <Pressable
      accessibilityLabel={`${label}${selected ? ', selected' : ''}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.modeButton, selected ? styles.selectedMode : null]}
    >
      <Text style={[styles.modeText, selected ? styles.selectedModeText : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
  },
  inputContainer: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surface,
  },
  searchIcon: {
    marginRight: spacing.xs,
    color: colors.textMuted,
    fontSize: typography.fontSize.heading,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.body,
  },
  clearInput: {
    paddingHorizontal: spacing.xs,
  },
  clearText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.heading,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  modeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.surface,
  },
  selectedMode: {
    backgroundColor: colors.accent,
  },
  modeText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.small,
  },
  selectedModeText: {
    color: colors.background,
    fontWeight: typography.fontWeight.semibold,
  },
});
