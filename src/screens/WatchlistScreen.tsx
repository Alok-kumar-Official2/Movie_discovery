/** Displays persisted saved titles in the shared grid with per-card heart removal. */
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, type ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MovieCardData } from '../api/types';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { MovieCard } from '../components/movie/MovieCard';
import { MovieGrid } from '../components/movie/MovieGrid';
import { ErrorView } from '../components/common/ErrorView';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { useWatchlist } from '../context/WatchlistContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

export function WatchlistScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { movies, isLoading, storageError, clear, retryStorage } = useWatchlist();
  const openMovie = useCallback(
    (movieId: number) => navigation.navigate('MovieDetails', { movieId }),
    [navigation],
  );
  const renderMovie = useCallback<ListRenderItem<MovieCardData>>(
    ({ item }) => <MovieCard movie={item} onPress={openMovie} variant="grid" />,
    [openMovie],
  );

  if (!isLoading && storageError && movies.length === 0) {
    return (
      <ScreenContainer>
        <OfflineBanner />
        <View style={styles.header}>
          <WatchlistHeader
            onAbout={() => navigation.navigate('About')}
            onClear={() => void clear()}
            hasMovies={false}
            storageError={null}
            onRetry={() => void retryStorage()}
          />
          <ErrorView message={storageError} onRetry={() => void retryStorage()} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <OfflineBanner />
      <MovieGrid
        emptyTitle="Your watchlist is empty"
        emptyMessage="Save a movie from its details page and it will appear here."
        header={
          <WatchlistHeader
            hasMovies={movies.length > 0}
            onClear={clear}
            onAbout={() => navigation.navigate('About')}
            storageError={storageError}
            onRetry={() => void retryStorage()}
          />
        }
        isLoading={isLoading}
        items={movies}
        keyExtractor={(movie) => String(movie.id)}
        renderItem={renderMovie}
      />
    </ScreenContainer>
  );
}

interface WatchlistHeaderProps {
  hasMovies: boolean;
  onClear: () => void;
  onAbout: () => void;
  storageError: string | null;
  onRetry: () => void;
}

function WatchlistHeader({
  hasMovies,
  onClear,
  onAbout,
  storageError,
  onRetry,
}: WatchlistHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>My Watchlist</Text>
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel="About Movie Discovery and TMDB attribution"
            accessibilityRole="button"
            onPress={onAbout}
          >
            <Text style={styles.action}>About</Text>
          </Pressable>
          {hasMovies ? (
            <Pressable
              accessibilityLabel="Clear all watchlist movies"
              accessibilityRole="button"
              onPress={() => void onClear()}
            >
              <Text style={styles.action}>Clear</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      {storageError ? <ErrorView message={storageError} onRetry={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.heading,
    fontWeight: typography.fontWeight.bold,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  action: {
    color: colors.accent,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
});
