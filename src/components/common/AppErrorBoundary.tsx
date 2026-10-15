/** Keeps unexpected render failures inside a friendly, recoverable app-level screen. */
import { Component, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public state: AppErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  private retry = (): void => {
    this.setState({ hasError: false });
  };

  public render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.content}>
          <Text style={styles.title}>We hit an unexpected problem</Text>
          <Text style={styles.message}>
            The app could not display this screen. Try again to continue.
          </Text>
          <Pressable
            accessibilityLabel="Try loading the app again"
            accessibilityRole="button"
            onPress={this.retry}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusPill,
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.background,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.bold,
  },
});
