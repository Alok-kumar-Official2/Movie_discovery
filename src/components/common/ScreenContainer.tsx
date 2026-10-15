/** Applies safe-area insets and the shared dark background to screen content. */
import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors } from '../../theme';

interface ScreenContainerProps {
  children: ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
}

export function ScreenContainer({
  children,
  edges = ['top', 'left', 'right'],
  style,
}: ScreenContainerProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
