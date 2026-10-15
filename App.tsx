/** App root: provides safe areas, React Query, and credential-gated navigation. */
import { onlineManager, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { hasTmdbToken } from './src/api/client';
import { AppErrorBoundary } from './src/components/common/AppErrorBoundary';
import { ErrorView } from './src/components/common/ErrorView';
import { MissingTokenScreen } from './src/screens/MissingTokenScreen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { queryClient } from './src/hooks/queryClient';
import { useConfiguration } from './src/hooks/useMovieLists';
import { WatchlistProvider } from './src/context/WatchlistContext';
import { getUserErrorMessage } from './src/utils/errors';

function AppContent() {
  const configurationQuery = useConfiguration();
  // Feed real device connectivity to React Query so reconnects can resume stale work.
  useEffect(
    () =>
      onlineManager.setEventListener((setOnline) =>
        NetInfo.addEventListener((state) => {
          setOnline(state.isConnected !== false && state.isInternetReachable !== false);
        }),
      ),
    [],
  );

  return (
    <View style={styles.root}>
      {configurationQuery.error ? (
        <ErrorView
          message={getUserErrorMessage(
            configurationQuery.error,
            'Unable to load TMDB image configuration.',
          )}
          onRetry={() => void configurationQuery.refetch()}
        />
      ) : null}
      <RootNavigator />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppErrorBoundary>
        <StatusBar style="light" />
        {hasTmdbToken ? (
          <QueryClientProvider client={queryClient}>
            <WatchlistProvider>
              <AppContent />
            </WatchlistProvider>
          </QueryClientProvider>
        ) : (
          <MissingTokenScreen />
        )}
      </AppErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
